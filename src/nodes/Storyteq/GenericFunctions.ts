import type { IExecuteFunctions, IHttpRequestOptions, IDataObject } from 'n8n-workflow';

export interface StoryteqCredentials {
	cmpTenant?: string;
	clientId?: string;
	username?: string;
	apiPassword?: string;
	grantType?: string;
	refreshToken?: string;
}

/**
 * Get Storyteq credentials
 */
export async function getCredentials(
	this: IExecuteFunctions,
): Promise<StoryteqCredentials> {
	const credentials = await this.getCredentials('storyteqApi');
	return {
		cmpTenant: credentials.cmpTenant as string | undefined,
		clientId: credentials.clientId as string | undefined,
		username: credentials.username as string | undefined,
		apiPassword: credentials.apiPassword as string | undefined,
		grantType: credentials.grantType as string | undefined,
		refreshToken: credentials.refreshToken as string | undefined,
	};
}

/**
 * Get base URL for Storyteq CMP v2 API
 */
export function getBaseUrl(): string {
	return 'https://enterprise.api.storyteq.com/cmp/v2';
}

/**
 * Get a new access token using password grant
 */
async function getTokenFromPassword(
	this: IExecuteFunctions,
	credentials: StoryteqCredentials,
): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
	if (!credentials.clientId || !credentials.username || !credentials.apiPassword || !credentials.cmpTenant) {
		throw new Error('Missing required credentials for token refresh (clientId, username, password, cmpTenant)');
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://enterprise.api.storyteq.com/cmp/v2/token',
		headers: {
			'CMP-Tenant': credentials.cmpTenant,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: {
			client_id: credentials.clientId,
			username: credentials.username,
			password: credentials.apiPassword,
			grant_type: 'password',
		},
		json: true,
	};

	const response = await this.helpers.httpRequest(options);
	return response as { access_token: string; refresh_token?: string; expires_in?: number };
}

/**
 * Get a new access token using refresh token
 */
async function getTokenFromRefreshToken(
	this: IExecuteFunctions,
	credentials: StoryteqCredentials,
): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
	if (!credentials.clientId || !credentials.refreshToken || !credentials.cmpTenant) {
		throw new Error('Missing required credentials for token refresh (clientId, refreshToken, cmpTenant)');
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://enterprise.api.storyteq.com/cmp/v2/token',
		headers: {
			'CMP-Tenant': credentials.cmpTenant,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: {
			client_id: credentials.clientId,
			grant_type: 'refresh_token',
			refresh_token: credentials.refreshToken,
		},
		json: true,
	};

	const response = await this.helpers.httpRequest(options);
	return response as { access_token: string; refresh_token?: string; expires_in?: number };
}

/**
 * Get or refresh access token automatically
 */
export async function ensureValidToken(
	this: IExecuteFunctions,
	credentials: StoryteqCredentials,
): Promise<string> {
	// Tokens are automatically managed - always get a fresh token
	// This ensures tokens are always valid and refreshed as needed
	
	let tokenResponse: { access_token: string; refresh_token?: string; expires_in?: number };
	
	// Try refresh token first if available, otherwise use password
	if (credentials.refreshToken && credentials.grantType === 'refresh_token') {
		try {
			tokenResponse = await getTokenFromRefreshToken.call(this, credentials);
			console.log('[Storyteq] Token obtained using refresh token');
		} catch {
			// Refresh token failed, fall back to password
			console.log('[Storyteq] Refresh token failed, falling back to password grant');
			tokenResponse = await getTokenFromPassword.call(this, credentials);
		}
	} else {
		tokenResponse = await getTokenFromPassword.call(this, credentials);
		console.log('[Storyteq] Token obtained using password grant');
	}

	// Store refresh token if provided (for future use)
	if (tokenResponse.refresh_token) {
		// Note: We can't directly update credentials from here, but we can use it in memory
		credentials.refreshToken = tokenResponse.refresh_token;
	}

	return tokenResponse.access_token;
}

/**
 * Make authenticated API request to Storyteq
 */
/**
 * Make authenticated API request to Storyteq
 */
export async function apiRequest(
	this: IExecuteFunctions,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
	endpoint: string,
	body?: IDataObject,
	queryParams?: Record<string, string | string[] | number[] | boolean | number>,
): Promise<IDataObject> {
	const credentials = await getCredentials.call(this);
	const baseUrl = getBaseUrl();

	let url = `${baseUrl}${endpoint}`;

	// Add query parameters if provided
	if (queryParams && Object.keys(queryParams).length > 0) {
		const urlObj = new URL(url);
		Object.entries(queryParams).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((v) => urlObj.searchParams.append(key, String(v)));
			} else {
				urlObj.searchParams.append(key, String(value));
			}
		});
		url = urlObj.toString();
	}

	const options: IHttpRequestOptions = {
		method,
		url,
		headers: {
			'Content-Type': 'application/json',
		},
		json: true,
	};

	// Validate required credentials
	if (!credentials.cmpTenant) {
		throw new Error('CMP Tenant URL is required in credentials.');
	}

	// Get or refresh token automatically
	let bearerToken = await ensureValidToken.call(this, credentials);
	
	options.headers = {
		...options.headers,
		Authorization: `Bearer ${bearerToken}`,
		'CMP-Tenant': credentials.cmpTenant,
	};

	if (body) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options);
		return response as IDataObject & Record<string, unknown>;
	} catch (error) {
		const statusCode = (error as { response?: { status?: number } })?.response?.status;
		const responseData = (error as { response?: { data?: unknown } })?.response?.data;
		
		console.error('[Storyteq] API Request failed:', {
			method,
			url,
			error: error instanceof Error ? error.message : String(error),
			statusCode,
			responseData,
		});

		// Handle authentication errors - try to refresh token
		if (statusCode === 401 || statusCode === 403) {
			// Token might be expired, try to refresh
			if (credentials.refreshToken) {
				console.log('[Storyteq] Token expired, attempting to refresh...');
				try {
					const tokenResponse = await getTokenFromRefreshToken.call(this, credentials);
					bearerToken = tokenResponse.access_token;
					if (tokenResponse.refresh_token) {
						credentials.refreshToken = tokenResponse.refresh_token;
					}
					
					// Retry the original request with new token
					options.headers = {
						...options.headers,
						Authorization: `Bearer ${bearerToken}`,
					};
					
					console.log('[Storyteq] Token refreshed, retrying request...');
					const retryResponse = await this.helpers.httpRequest(options);
					return retryResponse as IDataObject & Record<string, unknown>;
				} catch (refreshError) {
					console.error('[Storyteq] Token refresh failed:', refreshError);
					// Fall through to throw original error
				}
			}
			
			// If refresh failed or no refresh token, try password grant
			if (statusCode === 401 || statusCode === 403) {
				console.log('[Storyteq] Attempting to get new token using password grant...');
				try {
					const tokenResponse = await getTokenFromPassword.call(this, credentials);
					bearerToken = tokenResponse.access_token;
					if (tokenResponse.refresh_token) {
						credentials.refreshToken = tokenResponse.refresh_token;
					}
					
					// Retry the original request with new token
					options.headers = {
						...options.headers,
						Authorization: `Bearer ${bearerToken}`,
					};
					
					console.log('[Storyteq] New token obtained, retrying request...');
					const retryResponse = await this.helpers.httpRequest(options);
					return retryResponse as IDataObject & Record<string, unknown>;
				} catch (tokenError) {
					console.error('[Storyteq] Failed to obtain new token:', tokenError);
					throw new Error(`Authentication failed (${statusCode}). Unable to refresh token. Please check your credentials.`);
				}
			}
		}

		throw error;
	}
}


