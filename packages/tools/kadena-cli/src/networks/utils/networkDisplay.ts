import {
  defaultNetworksPath,
  networkDefaults,
} from '../../constants/networks.js';

import { log } from '../../utils/logger.js';

import { getExistingNetworks } from '../../utils/helpers.js';
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
  ];
  const rows: TableRow[] = [];

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
    ]);
  }

  log.output(log.generateTableString(header, rows));
}
