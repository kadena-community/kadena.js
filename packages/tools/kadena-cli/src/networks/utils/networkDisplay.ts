import {
  defaultNetworksPath,
  networkDefaults,
} from '../../constants/networks.js';

import { getExistingNetworks } from '../../utils/helpers.js';
import type {
  ICustomNetworkChoice,
  INetworkCreateOptions,
} from './networkHelpers.js';

import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';
import { displayTable } from '../../utils/tableDisplay.js';

export function displayNetworksConfig(): void {
  const header: TableHeader = [
    'Network',
    'Network ID',
    'Network Host',
    'Network Explorer URL',
  ];
  const rows: TableRow[] = [];

  const existingNetworks: ICustomNetworkChoice[] = getExistingNetworks();
  const standardNetworks: string[] = ['mainnet', 'testnet'];

  existingNetworks
    .concat(
      standardNetworks.map((network) => ({ label: network, value: network })),
    )
    .forEach(({ value }) => {
      const networkFilePath = path.join(defaultNetworksPath, `${value}.yaml`);
      const fileExists = existsSync(networkFilePath);
      const networkConfig: INetworkCreateOptions = fileExists
        ? (yaml.load(
            readFileSync(networkFilePath, 'utf8'),
          ) as INetworkCreateOptions)
        : networkDefaults[value] !== undefined
        ? networkDefaults[value]
        : ({} as INetworkCreateOptions);

      rows.push([
        value,
        networkConfig.networkId || 'Not Set',
        networkConfig.networkHost || 'Not Set',
        networkConfig.networkExplorerUrl || 'Not Set',
      ]);
    });

  displayTable(header, rows);
}
