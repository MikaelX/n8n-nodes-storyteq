import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Asset IDs',
		name: 'assetIds',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of asset IDs (e.g., "123,456,789")',
	},
	{
		displayName: 'Intents',
		name: 'intents',
		type: 'options',
		options: [
			{
				name: 'Download',
				value: 'Download',
			},
		],
		default: 'Download',
		required: true,
		description: 'Specifies the required operation',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetIds = this.getNodeParameter('assetIds', itemIndex) as string;
	const intents = this.getNodeParameter('intents', itemIndex) as string;

	const responseData = await apiRequest.call(this, 'GET', `/GetAssetDerivativeMenu`, undefined, {
		assetIDs: assetIds,
		intents,
	});

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

