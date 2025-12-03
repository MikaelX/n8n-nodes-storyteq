import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		required: true,
		description: 'ID of the media to retrieve',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const mediaId = this.getNodeParameter('mediaId', itemIndex) as number;

	// Make API request
	const responseData = await apiRequest.call(this, 'GET', `/content/media/${mediaId}`);

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

