import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
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
	{
		displayName: 'Download Type',
		name: 'downloadOperation',
		type: 'options',
		options: [
			{
				name: 'Link',
				value: 'Link',
				description: 'Get signed download link (returns URL, name, expires, generated)',
			},
		],
		default: 'Link',
		required: true,
		description: 'Download operation type. Returns a signed URL that can be used to download the asset.',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetId = this.getNodeParameter('assetId', itemIndex) as number;
	const downloadOperation = this.getNodeParameter('downloadOperation', itemIndex) as string;

	if (!assetId || assetId < 1) {
		throw new Error('Asset ID must be a positive integer');
	}

	if (downloadOperation !== 'Link') {
		throw new Error('Download operation must be "Link"');
	}

	// Use DownloadAsset endpoint (legacy but simpler - doesn't require transformID)
	// Returns: { url: string, name: string, expires: string, generated: string }
	const responseData = await apiRequest.call(this, 'GET', `/DownloadAsset`, undefined, {
		assetID: assetId,
		operation: downloadOperation,
	});

	if (!responseData || typeof responseData !== 'object') {
		throw new Error('Invalid response from DownloadAsset endpoint');
	}

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

