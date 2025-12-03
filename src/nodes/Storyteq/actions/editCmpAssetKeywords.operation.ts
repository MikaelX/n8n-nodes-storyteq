import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Asset IDs',
		name: 'assetIDs',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of asset IDs to modify',
	},
	{
		displayName: 'Keyword IDs',
		name: 'keywordIDs',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of keyword IDs to add or remove',
	},
	{
		displayName: 'Keyword Operation',
		name: 'keywordOperation',
		type: 'options',
		options: [
			{
				name: 'Add',
				value: 'Add',
			},
			{
				name: 'Remove',
				value: 'Remove',
			},
		],
		default: 'Add',
		required: true,
		description: 'Whether to add or remove keywords from the asset',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetIDs = this.getNodeParameter('assetIDs', itemIndex) as string;
	const keywordIDs = this.getNodeParameter('keywordIDs', itemIndex) as string;
	const keywordOperation = this.getNodeParameter('keywordOperation', itemIndex) as string;

	const body = {
		assetIDs,
		keywordIDs,
		operation: keywordOperation,
	};

	await apiRequest.call(this, 'POST', '/EditAssetKeywords', body, {
		binding: 'Asset',
	});

	return {
		json: { success: true },
		pairedItem: {
			item: itemIndex,
		},
	};
}

