import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		required: true,
		description: 'ID of the template to retrieve',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const templateId = this.getNodeParameter('templateId', itemIndex) as number;

	// Make API request
	const responseData = await apiRequest.call(this, 'GET', `/content/templates/${templateId}`);

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

