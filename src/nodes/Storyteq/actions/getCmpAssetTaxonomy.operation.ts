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
		description: 'ID of the asset to get taxonomy for',
	},
	{
		displayName: 'Ignore Domains',
		name: 'ignoreDomains',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether to ignore the domain object in the response',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetId = this.getNodeParameter('assetId', itemIndex) as number;
	const ignoreDomains = this.getNodeParameter('ignoreDomains', itemIndex) as boolean;

	const queryParams: Record<string, string | number | boolean> = {
		assetID: assetId,
		ignoreDomains: ignoreDomains,
	};

	const responseData = await apiRequest.call(this, 'GET', `/GetAssetTaxonomy`, undefined, queryParams);

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

