import type {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class StoryteqApi implements ICredentialType {
	name = 'storyteqApi';

	displayName = 'Storyteq API';

	documentationUrl = 'https://developer.storyteq.com/?urls.primaryName=Content+Management+Platform+API+V2';

	properties: INodeProperties[] = [
		{
			displayName: 'CMP Tenant URL',
			name: 'cmpTenant',
			type: 'string',
			default: '',
			required: true,
			description: 'The CMP tenant URL (e.g., https://your-tenant.storyteq.com)',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Client ID for CMP v2 authentication',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Username for CMP v2 authentication',
		},
		{
			displayName: 'Password',
			name: 'apiPassword',
			type: 'string',
			typeOptions: {
				password: true,
				autocomplete: 'new-password',
			},
			default: '',
			required: true,
			description: 'Password for CMP v2 authentication',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'options',
			options: [
				{
					name: 'Password',
					value: 'password',
					description: 'Use username and password to obtain token',
				},
				{
					name: 'Refresh Token',
					value: 'refresh_token',
					description: 'Use refresh token to obtain new access token',
				},
			],
			default: 'password',
			required: true,
			description: 'OAuth 2.0 grant type for authentication',
		},
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'Refresh token (auto-populated when obtaining tokens, used for automatic token refresh). Leave empty unless you need to set it manually.',
			// Prevent browser autofill - this field is auto-managed
			noDataExpression: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: '=https://enterprise.api.storyteq.com/cmp/v2/token',
			headers: {
				'CMP-Tenant': '={{$credentials.cmpTenant}}',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: '={{JSON.stringify({client_id: $credentials.clientId, username: $credentials.username, password: $credentials.apiPassword, grant_type: "password"})}}',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'access_token',
					value: '',
					message: 'Token obtained successfully',
				},
			},
		],
	};

	// Note: Tokens are automatically managed - bearerToken is not needed as a credential field
	// Authentication is handled manually in apiRequest to provide better error messages and automatic token refresh
}

