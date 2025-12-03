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
	{
		displayName: 'Narrative Name',
		name: 'name',
		type: 'options',
		options: [
			{
				name: 'Description',
				value: 'Description',
			},
			{
				name: 'Usage',
				value: 'Usage',
			},
		],
		default: 'Description',
		required: true,
		description: 'The name of the narrative field to modify (Description or Usage, or a custom narrative name)',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		required: true,
		description: 'The value to be stored in the narrative field',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetID = this.getNodeParameter('assetID', itemIndex) as number;
	const name = this.getNodeParameter('name', itemIndex) as string;
	const value = this.getNodeParameter('value', itemIndex) as string;

	const body = {
		assetID,
		name,
		value,
	};

	await apiRequest.call(this, 'POST', '/SetAssetNarrative', body);

	return {
		json: { success: true },
		pairedItem: {
			item: itemIndex,
		},
	};
}

