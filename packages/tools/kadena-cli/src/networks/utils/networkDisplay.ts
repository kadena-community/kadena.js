import {
  defaultNetworksPath,
  networkDefaults,
} from '../../constants/networks.js';

import { log } from '../../utils/logger.js';

import {
  getDefaultNetworkName,
  getExistingNetworks,
} from '../../utils/helpers.js';
import type {
  ICustomNetworkChoice,
  INetworkCreateOptions,
} from './networkHelpers.js';

import yaml from 'js-yaml';
import path from 'path';
import { services } from '../../services/index.js';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';

export async function displayNetworksConfig(): Promise<void> {
  const header: TableHeader = [
    'Network',
    'Network ID',
    'Network Host',
    'Network Explorer URL',
    'Default Network',
  ];
  const rows: TableRow[] = [];
  const defaultNetworkName = await getDefaultNetworkName();
  const existingNetworks: ICustomNetworkChoice[] = await getExistingNetworks();
  for (const { value } of existingNetworks) {
    const networkFilePath = path.join(defaultNetworksPath, `${value}.yaml`);
    const fileContent = await services.filesystem.readFile(networkFilePath);
    const networkConfig: INetworkCreateOptions =
      fileContent !== null
        ? (yaml.load(fileContent) as INetworkCreateOptions)
        : networkDefaults[value] !== undefined
        ? networkDefaults[value]
        : ({} as INetworkCreateOptions);

    rows.push([
      value,
      networkConfig.networkId ?? 'Not Set',
      networkConfig.networkHost ?? 'Not Set',
      networkConfig.networkExplorerUrl ?? 'Not Set',
      value === defaultNetworkName ? 'Yes' : 'No',
    ]);
  }

  log.output(log.generateTableString(header, rows));
}
