import { globalOptions } from '../../utils/globalOptions.js';
import {
  removeDefaultNetwork,
  removeNetwork,
} from '../utils/networkHelpers.js';

import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import { getDefaultNetworkName } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { networkOptions } from '../networkOptions.js';

export const deleteNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete',
  'Delete local network',
  [
    globalOptions.network({ isOptional: false }),
    networkOptions.networkDelete(),
  ],
  async (option) => {
    const defaultNetworkName = await getDefaultNetworkName();
    const networkData = await option.network();
    const isDefaultNetwork = networkData.network === defaultNetworkName;
    const deleteNetwork = await option.networkDelete({
      isDefaultNetwork,
    });

    log.debug('delete-network:action', {
      ...networkData,
      ...deleteNetwork,
    });

    if (deleteNetwork.networkDelete === 'no') {
      log.info(
        log.color.yellow(
          `\nThe network configuration "${networkData.network}" will not be deleted.\n`,
        ),
      );
      return;
    }

    await removeNetwork(networkData.networkConfig);
    await removeDefaultNetwork();

    log.info(
      log.color.green(
        `\nThe network configuration "${networkData.network}" has been deleted.\n`,
      ),
    );
  },
);
