import type { IExecuteFunctions, INodeProperties, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';
import { getCredentials, getBaseUrl, ensureValidToken } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetID',
		type: 'number',
		default: 0,
		required: true,
		description: 'The ID of the asset',
	},
	{
		displayName: 'Recipe',
		name: 'recipe',
		type: 'options',
		options: [
			{
				name: 'Icon 512',
				value: 'Icon_512',
			},
			{
				name: 'Icon 256',
				value: 'Icon_256',
			},
			{
				name: 'Icon 128',
				value: 'Icon_128',
			},
			{
				name: 'Icon 64',
				value: 'Icon_64',
			},
		],
		default: 'Icon_512',
		required: true,
		description: 'The thumbnail size recipe',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetID = this.getNodeParameter('assetID', itemIndex) as number;
	const recipe = this.getNodeParameter('recipe', itemIndex) as string;
	const credentials = await getCredentials.call(this);
	const baseUrl = getBaseUrl();

	// Get token
	const token = await ensureValidToken.call(this, credentials);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${baseUrl}/DownloadAssetPreview`,
		headers: {
			'CMP-Tenant': credentials.cmpTenant!,
			Authorization: `Bearer ${token}`,
		},
		qs: {
			assetID,
			recipe,
		},
		encoding: 'arraybuffer',
	};

	const response = await this.helpers.httpRequest(options);

	return {
		json: {
			assetID,
			recipe,
		},
		binary: {
			data: await this.helpers.prepareBinaryData(Buffer.from(response as ArrayBuffer), `asset-${assetID}-${recipe}.png`),
		},
		pairedItem: {
			item: itemIndex,
		},
	};
}

