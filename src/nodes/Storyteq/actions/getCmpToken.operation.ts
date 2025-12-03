import type { IExecuteFunctions, INodeProperties, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';
import { getCredentials } from '../GenericFunctions';

export const description: INodeProperties[] = [
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
		required: false,
		description: 'OAuth 2.0 grant type. If not specified, uses the grant type from credentials.',
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
		description: 'Refresh token (required if Grant Type is Refresh Token)',
		displayOptions: {
			show: {
				grantType: ['refresh_token'],
			},
		},
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const credentials = await getCredentials.call(this);
	const grantType = (this.getNodeParameter('grantType', itemIndex, credentials.grantType || 'password') as string) || 'password';
	
	if (!credentials.clientId || !credentials.cmpTenant) {
		throw new Error('CMP v2 authentication requires clientId and cmpTenant to be set in credentials');
	}

	if (grantType === 'refresh_token') {
		const refreshToken = this.getNodeParameter('refreshToken', itemIndex, credentials.refreshToken) as string;
		if (!refreshToken) {
			throw new Error('Refresh token is required when grant type is refresh_token');
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
				refresh_token: refreshToken,
			},
			json: true,
		};

		const response = await this.helpers.httpRequest(options);
		return {
			json: response,
			pairedItem: {
				item: itemIndex,
			},
		};
	} else {
		// Password grant type
		if (!credentials.username || !credentials.apiPassword) {
			throw new Error('CMP v2 authentication requires username and password when using password grant type');
		}

		// Token endpoint uses JSON (despite OpenAPI spec documentation saying form-urlencoded)
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

		return {
			json: response,
			pairedItem: {
				item: itemIndex,
			},
		};
	}
}

