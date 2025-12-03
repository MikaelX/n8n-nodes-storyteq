import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetID',
		type: 'number',
		default: 0,
		required: true,
		description: 'The ID of the asset',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetID = this.getNodeParameter('assetID', itemIndex) as number;

	const responseData = await apiRequest.call(this, 'GET', '/GetAssetInfo', undefined, {
		assetID,
	});

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

