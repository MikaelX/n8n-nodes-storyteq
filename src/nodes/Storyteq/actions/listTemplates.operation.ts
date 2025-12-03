import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	// Make API request
	const responseData = await apiRequest.call(this, 'GET', '/content/templates/');

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

