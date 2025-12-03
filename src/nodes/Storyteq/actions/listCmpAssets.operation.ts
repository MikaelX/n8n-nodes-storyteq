import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDomains',
		},
		default: '',
		required: true,
		description: 'The ID of the domain',
	},
	{
		displayName: 'Phase',
		name: 'phase',
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'Active',
			},
		],
		default: 'Active',
		required: true,
		description: 'The phase of the asset',
	},
	{
		displayName: 'Listing Style',
		name: 'listingStyle',
		type: 'options',
		options: [
			{
				name: 'Page',
				value: 'Page',
			},
		],
		default: 'Page',
		required: true,
		description: 'Returns the results in paged format',
	},
	{
		displayName: 'Listing Limit',
		name: 'listingLimit',
		type: 'options',
		options: [
			{
				name: '20',
				value: '20',
			},
			{
				name: '50',
				value: '50',
			},
			{
				name: '100',
				value: '100',
			},
		],
		default: '100',
		required: true,
		description: 'Number of results per page',
	},
	{
		displayName: 'Listing Offset',
		name: 'listingOffset',
		type: 'number',
		typeOptions: {
			minValue: 0,
		},
		default: 0,
		required: false,
		description: 'Index of the first record (for pagination)',
	},
	{
		displayName: 'Listing Sort',
		name: 'listingSort',
		type: 'options',
		options: [
			{
				name: 'Asset Name',
				value: 'asset-name',
			},
			{
				name: 'Asset Created',
				value: 'asset-created',
			},
			{
				name: 'Asset Modified',
				value: 'asset-modified',
			},
			{
				name: 'Asset Type',
				value: 'asset-type',
			},
			{
				name: 'Asset State',
				value: 'asset-state',
			},
		],
		default: 'asset-name',
		required: false,
		description: 'Attribute to sort by',
	},
	{
		displayName: 'Listing Order',
		name: 'listingOrder',
		type: 'options',
		options: [
			{
				name: 'Ascending',
				value: 'Ascending',
			},
			{
				name: 'Descending',
				value: 'Descending',
			},
		],
		default: 'Ascending',
		required: false,
		description: 'Sort direction',
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		default: '',
		required: false,
		description: 'Simple text search on asset name',
	},
	{
		displayName: 'Available',
		name: 'available',
		type: 'boolean',
		default: false,
		required: false,
		description: 'Only include available assets (default: false includes all)',
	},
	{
		displayName: 'Inherit',
		name: 'inherit',
		type: 'boolean',
		default: false,
		required: false,
		description: 'Include assets from all parent domains',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const domainId = this.getNodeParameter('domainId', itemIndex) as number;
	const phase = this.getNodeParameter('phase', itemIndex) as string;
	const listingStyle = this.getNodeParameter('listingStyle', itemIndex) as string;
	const listingLimit = this.getNodeParameter('listingLimit', itemIndex) as string;
	const listingOffset = this.getNodeParameter('listingOffset', itemIndex, 0) as number;
	const listingSort = this.getNodeParameter('listingSort', itemIndex, 'asset-name') as string;
	const listingOrder = this.getNodeParameter('listingOrder', itemIndex, 'Ascending') as string;
	const search = this.getNodeParameter('search', itemIndex, '') as string;
	const available = this.getNodeParameter('available', itemIndex, false) as boolean;
	const inherit = this.getNodeParameter('inherit', itemIndex, false) as boolean;

	const queryParams: Record<string, string | number | boolean> = {
		domainID: domainId,
		phase,
		collation: 'Assets',
		tree: 'Assets',
		'listing-style': listingStyle,
		'listing-limit': listingLimit,
		'listing-offset': listingOffset,
		'listing-sort': listingSort,
		'listing-order': listingOrder,
		available,
		inherit,
	};

	if (search) {
		queryParams.search = search;
	}

	const responseData = await apiRequest.call(this, 'GET', `/ListAssets`, undefined, queryParams);

	return {
		json: responseData,
		pairedItem: {
			item: itemIndex,
		},
	};
}

