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
		description: 'ID of the template to create media on',
	},
	{
		displayName: 'Template Parameters',
		name: 'templateParameters',
		type: 'json',
		default: '{}',
		required: true,
		description: 'JSON object with key-value pairs for template parameters',
	},
	{
		displayName: 'Notifications',
		name: 'notifications',
		type: 'json',
		default: '[]',
		required: false,
		description: 'JSON array of webhook notifications (optional)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const templateId = this.getNodeParameter('templateId', itemIndex) as number;
	const templateParametersJson = this.getNodeParameter('templateParameters', itemIndex) as string;
	const notificationsJson = this.getNodeParameter('notifications', itemIndex, '[]') as string;

	// Parse template parameters
	let templateParameters: Record<string, string> = {};
	try {
		templateParameters = JSON.parse(templateParametersJson);
		if (typeof templateParameters !== 'object' || Array.isArray(templateParameters)) {
			throw new Error('Template parameters must be a JSON object');
		}
	} catch (error) {
		throw new Error(
			`Invalid JSON in Template Parameters: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	// Parse notifications (optional)
	let notifications: Array<{ type: string; route: string }> = [];
	if (notificationsJson && notificationsJson !== '[]') {
		try {
			notifications = JSON.parse(notificationsJson);
			if (!Array.isArray(notifications)) {
				throw new Error('Notifications must be a JSON array');
			}
		} catch (error) {
			throw new Error(
				`Invalid JSON in Notifications: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	// Build request body
	const body: {
		template_parameters: Record<string, string>;
		notifications?: Array<{ type: string; route: string }>;
	} = {
		template_parameters: templateParameters,
	};

	if (notifications.length > 0) {
		body.notifications = notifications;
	}

	// Make API request
	const responseData = await apiRequest.call(
		this,
		'POST',
		`/content/templates/${templateId}/media`,
		body,
	);

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

