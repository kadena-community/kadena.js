import {
  NO_NETWORKS_FOUND_ERROR_MESSAGE,
  networkDefaults,
} from '../../../constants/networks.js';

import { log } from '../../../utils/logger.js';

import {
  getDefaultNetworkName,
  getExistingNetworks,
} from '../../../utils/helpers.js';
import type {
  ICustomNetworkChoice,
  INetworkCreateOptions,
} from './networkHelpers.js';

import yaml from 'js-yaml';
import path from 'path';
import { services } from '../../../services/index.js';
import { createTable } from '../../../utils/table.js';
import { getNetworkDirectory } from './networkPath.js';

export async function displayNetworksConfig(): Promise<void> {
  const networkDir = getNetworkDirectory();

  const table = createTable({
    head: [
      'Network',
      'Network ID',
      'Network Host',
      'Network Explorer URL',
      'Default Network',
    ],
  });

  const defaultNetworkName = await getDefaultNetworkName();
  const existingNetworks: ICustomNetworkChoice[] = await getExistingNetworks();

  if (existingNetworks.length === 0) {
    return log.warning(NO_NETWORKS_FOUND_ERROR_MESSAGE);
  }

  const networks = await Promise.all(
    existingNetworks.map(async (network) => {
      const networkFilePath = path.join(networkDir!, `${network.value}.yaml`);
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
    table.push([
      network.network,
      network.networkId ?? 'Not Set',
      network.networkHost ?? 'Not Set',
      network.networkExplorerUrl ?? 'Not Set',
      network.network === defaultNetworkName ? 'Yes' : 'No',
    ]);
  }

  log.output(table.toString(), {
    networks,
    default: defaultNetworkName,
  });
}
