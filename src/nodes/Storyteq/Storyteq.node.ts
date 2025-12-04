import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { operations } from './actions';

export class Storyteq implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Storyteq',
		name: 'storyteq',
		icon: 'file:storyteq.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume the Storyteq API',
		defaults: {
			name: 'Storyteq',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'storyteqApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Asset URL',
						value: 'downloadCmpAsset',
						description: 'Get signed download URL for asset derivative',
						action: 'Get asset URL',
					},
					{
						name: 'Download Asset Preview',
						value: 'downloadCmpAssetPreview',
						description: 'Download asset thumbnail',
						action: 'Download asset preview',
					},
					{
						name: 'Download Asset',
						value: 'downloadAsset',
						description: 'Download asset binary file',
						action: 'Download asset',
					},
					{
						name: 'Get Asset',
						value: 'getCmpAsset',
						description: 'Get asset by ID',
						action: 'Get asset',
					},
					{
						name: 'Get Asset Info',
						value: 'getCmpAssetInfo',
						description: 'Get extended asset metadata',
						action: 'Get asset info',
					},
					{
						name: 'Get Asset Fields',
						value: 'getCmpAssetFields',
						description: 'Get asset custom fields',
						action: 'Get asset fields',
					},
					{
						name: 'Set Asset Fields',
						value: 'setCmpAssetFields',
						description: 'Set asset custom field values',
						action: 'Set asset fields',
					},
					{
						name: 'Get Asset Taxonomy',
						value: 'getCmpAssetTaxonomy',
						description: 'Get asset taxonomy',
						action: 'Get asset taxonomy',
					},
					{
						name: 'Edit Asset Keywords',
						value: 'editCmpAssetKeywords',
						description: 'Add or remove keywords from assets',
						action: 'Edit asset keywords',
					},
					{
						name: 'List Asset Narratives',
						value: 'listCmpAssetNarratives',
						description: 'List asset narratives',
						action: 'List asset narratives',
					},
					{
						name: 'Set Asset Narrative',
						value: 'setCmpAssetNarrative',
						description: 'Set Description or Usage narrative',
						action: 'Set asset narrative',
					},
					{
						name: 'List Asset Availability',
						value: 'listCmpAssetAvailability',
						description: 'List asset availability windows',
						action: 'List asset availability',
					},
					{
						name: 'Get Asset Derivative Menu',
						value: 'getCmpAssetDerivativeMenu',
						description: 'Get available derivatives for assets',
						action: 'Get asset derivative menu',
					},
					{
						name: 'List Assets',
						value: 'listCmpAssets',
						description: 'List assets with filters and pagination',
						action: 'List assets',
					},
					{
						name: 'List User Domains',
						value: 'listCmpUserDomains',
						description: 'List available user domains',
						action: 'List user domains',
					},
				],
				default: 'getCmpAsset',
				required: true,
			},
			// Add operation-specific properties dynamically
			...Object.entries(operations).flatMap(([operationValue, operation]) => {
				return operation.description.map((prop) => ({
					...prop,
					displayOptions: {
						show: {
							operation: [operationValue],
						},
					},
				}));
			}),
		],
	};

	methods = {
		loadOptions: {
			async getDomains(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('storyteqApi');
				const baseUrl = 'https://enterprise.api.storyteq.com/cmp/v2';

				// Get access token
				const tokenResponse = await this.helpers.httpRequest({
					method: 'POST',
					url: `${baseUrl}/token`,
					headers: {
						'CMP-Tenant': credentials.cmpTenant as string,
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
					body: {
						client_id: credentials.clientId,
						username: credentials.username,
						password: credentials.apiPassword,
						grant_type: 'password',
					},
					json: true,
				});

				const accessToken = (tokenResponse as { access_token?: string })?.access_token;
				if (!accessToken) {
					throw new Error('Failed to obtain access token');
				}

				// Fetch domains
				const domains = await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseUrl}/ListUserDomains`,
					headers: {
						'CMP-Tenant': credentials.cmpTenant as string,
						Authorization: `Bearer ${accessToken}`,
					},
					json: true,
				});

				if (!Array.isArray(domains)) {
					return [];
				}

				return domains.map((domain: { id: number; title: string; type?: string }) => ({
					name: domain.title || `Domain ${domain.id}`,
					value: domain.id,
					description: domain.type ? `Type: ${domain.type}` : undefined,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operations[operation]) {
					const result = await operations[operation].execute.call(this, i);
					returnData.push(result);
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				if (error instanceof Error) {
					throw error;
				}
				throw new Error(String(error));
			}
		}

		return [returnData];
	}
}

export default Storyteq;

