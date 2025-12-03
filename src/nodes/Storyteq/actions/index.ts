import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import * as getCmpAsset from './getCmpAsset.operation';
import * as getCmpAssetInfo from './getCmpAssetInfo.operation';
import * as getCmpAssetFields from './getCmpAssetFields.operation';
import * as getCmpAssetTaxonomy from './getCmpAssetTaxonomy.operation';
import * as listCmpAssetNarratives from './listCmpAssetNarratives.operation';
import * as downloadCmpAsset from './downloadCmpAsset.operation';
import * as downloadCmpAssetPreview from './downloadCmpAssetPreview.operation';
import * as getCmpAssetDerivativeMenu from './getCmpAssetDerivativeMenu.operation';
import * as listCmpAssets from './listCmpAssets.operation';
import * as listCmpAssetAvailability from './listCmpAssetAvailability.operation';
import * as setCmpAssetFields from './setCmpAssetFields.operation';
import * as setCmpAssetNarrative from './setCmpAssetNarrative.operation';
import * as editCmpAssetKeywords from './editCmpAssetKeywords.operation';
import * as listCmpUserDomains from './listCmpUserDomains.operation';

export const operations: Record<
	string,
	{
		description: INodeProperties[];
		execute: (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData>;
	}
> = {
	getCmpAsset: {
		description: getCmpAsset.description,
		execute: getCmpAsset.execute,
	},
	getCmpAssetInfo: {
		description: getCmpAssetInfo.description,
		execute: getCmpAssetInfo.execute,
	},
	getCmpAssetFields: {
		description: getCmpAssetFields.description,
		execute: getCmpAssetFields.execute,
	},
	getCmpAssetTaxonomy: {
		description: getCmpAssetTaxonomy.description,
		execute: getCmpAssetTaxonomy.execute,
	},
	listCmpAssetNarratives: {
		description: listCmpAssetNarratives.description,
		execute: listCmpAssetNarratives.execute,
	},
	downloadCmpAsset: {
		description: downloadCmpAsset.description,
		execute: downloadCmpAsset.execute,
	},
	downloadCmpAssetPreview: {
		description: downloadCmpAssetPreview.description,
		execute: downloadCmpAssetPreview.execute,
	},
	getCmpAssetDerivativeMenu: {
		description: getCmpAssetDerivativeMenu.description,
		execute: getCmpAssetDerivativeMenu.execute,
	},
	listCmpAssets: {
		description: listCmpAssets.description,
		execute: listCmpAssets.execute,
	},
	listCmpAssetAvailability: {
		description: listCmpAssetAvailability.description,
		execute: listCmpAssetAvailability.execute,
	},
	setCmpAssetFields: {
		description: setCmpAssetFields.description,
		execute: setCmpAssetFields.execute,
	},
	setCmpAssetNarrative: {
		description: setCmpAssetNarrative.description,
		execute: setCmpAssetNarrative.execute,
	},
	editCmpAssetKeywords: {
		description: editCmpAssetKeywords.description,
		execute: editCmpAssetKeywords.execute,
	},
	listCmpUserDomains: {
		description: listCmpUserDomains.description,
		execute: listCmpUserDomains.execute,
	},
};

