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
		displayName: 'Fields',
		name: 'fields',
		type: 'json',
		default: '{}',
		required: true,
		description:
			'JSON object with field IDs as keys and values as arrays of strings. Example: {"123": ["value1", "value2"], "456": ["value3"]}',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const assetID = this.getNodeParameter('assetID', itemIndex) as number;
	const fieldsJson = this.getNodeParameter('fields', itemIndex) as string;

	// Parse fields JSON
	let fields: Record<string, string[]>;
	try {
		fields = JSON.parse(fieldsJson);
		if (typeof fields !== 'object' || Array.isArray(fields)) {
			throw new Error('Fields must be a JSON object');
		}
	} catch (error) {
		throw new Error(
			`Invalid JSON in Fields: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	const body = {
		assetID,
		fields,
	};

	await apiRequest.call(this, 'POST', '/SetAssetFields', body);

	return {
		json: { success: true },
		pairedItem: {
			item: itemIndex,
		},
	};
}

