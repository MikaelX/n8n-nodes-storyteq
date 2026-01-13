import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { Readable } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
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

	// Build URL with query parameters
	const url = new URL(`${baseUrl}/DownloadAssetPreview`);
	url.searchParams.append('assetID', String(assetID));
	url.searchParams.append('recipe', recipe);

	// Stream the download directly without loading into memory
	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			'CMP-Tenant': credentials.cmpTenant!,
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to download asset preview: ${response.status} ${response.statusText}`);
	}

	if (!response.body) {
		throw new Error('Response body is null');
	}

	// Convert Web ReadableStream to Node.js Readable stream
	const stream = Readable.fromWeb(response.body as unknown as NodeReadableStream);

	return {
		json: {
			assetID,
			recipe,
		},
		binary: {
			data: await this.helpers.prepareBinaryData(stream, `asset-${assetID}-${recipe}.png`),
		},
		pairedItem: {
			item: itemIndex,
		},
	};
}

