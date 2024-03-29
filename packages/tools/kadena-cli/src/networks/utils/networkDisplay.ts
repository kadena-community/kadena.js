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
import { KadenaError } from '../../services/service-error.js';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';

export async function displayNetworksConfig(): Promise<void> {
  if (defaultNetworksPath === null) {
    throw new KadenaError('no_kadena_directory');
  }

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

  const networks = await Promise.all(
    existingNetworks.map(async (network) => {
      const networkFilePath = path.join(
        defaultNetworksPath,
        `${network.value}.yaml`,
      );
      const fileContent = await services.filesystem.readFile(networkFilePath);
      const networkConfig: INetworkCreateOptions =
        fileContent !== null
          ? (yaml.load(fileContent) as INetworkCreateOptions)
          : networkDefaults[network.value] !== undefined
          ? networkDefaults[network.value]
          : ({} as INetworkCreateOptions);
      return {
        ...networkConfig,
      };
    }),
  );

  for (const network of networks) {
    rows.push([
      network.network,
      network.networkId ?? 'Not Set',
      network.networkHost ?? 'Not Set',
      network.networkExplorerUrl ?? 'Not Set',
      network.network === defaultNetworkName ? 'Yes' : 'No',
    ]);
  }

  log.output(log.generateTableString(header, rows), {
    networks,
    default: defaultNetworkName,
  });
}
