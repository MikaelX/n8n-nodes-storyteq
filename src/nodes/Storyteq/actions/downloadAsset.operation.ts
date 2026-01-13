import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { Readable } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		required: true,
		description: 'ID of the asset to download',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetId = this.getNodeParameter('assetId', itemIndex) as number;

	if (!assetId || assetId < 1) {
		throw new Error('Asset ID must be a positive integer');
	}

	// First, get the signed download URL
	const responseData = await apiRequest.call(this, 'GET', `/DownloadAsset`, undefined, {
		assetID: assetId,
		operation: 'Link',
	});

	if (!responseData || typeof responseData !== 'object') {
		throw new Error('Invalid response from DownloadAsset endpoint');
	}

	const downloadUrl = (responseData as { url?: string })?.url;
	if (!downloadUrl || typeof downloadUrl !== 'string') {
		throw new Error('Download URL not found in response');
	}

	const fileName = (responseData as { name?: string })?.name || `asset-${assetId}`;

	// Stream the download directly without loading into memory
	// Signed URLs don't require authentication headers as they're already authenticated via signature
	const response = await fetch(downloadUrl);
	
	if (!response.ok) {
		throw new Error(`Failed to download asset: ${response.status} ${response.statusText}`);
	}

	if (!response.body) {
		throw new Error('Response body is null');
	}

	// Convert Web ReadableStream to Node.js Readable stream
	const stream = Readable.fromWeb(response.body as unknown as NodeReadableStream);

	return {
		json: {
			assetId,
			url: downloadUrl,
			name: fileName,
		},
		binary: {
			data: await this.helpers.prepareBinaryData(stream, fileName),
		},
		pairedItem: {
			item: itemIndex,
		},
	};
}

