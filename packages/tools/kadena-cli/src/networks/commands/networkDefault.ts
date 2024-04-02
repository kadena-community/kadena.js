import type { Command } from 'commander';
import yaml from 'js-yaml';
import path from 'node:path';
import { isEmpty } from '../../account/utils/addHelpers.js';
import {
  defaultNetworksPath,
  defaultNetworksSettingsFilePath,
  defaultNetworksSettingsPath,
} from '../../constants/networks.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import {
  getDefaultNetworkName,
  isNotEmptyObject,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { networkOptions } from '../networkOptions.js';
import { removeDefaultNetwork } from '../utils/networkHelpers.js';

export const setNetworkDefault = async (
  network: string,
): Promise<CommandResult<{}>> => {
  try {
    const filePath = path.join(defaultNetworksPath, `${network}.yaml`);

    if (!(await services.filesystem.fileExists(filePath))) {
      return {
        status: 'error',
        errors: [
          `The network configuration for network "${network}" does not exist.`,
        ],
      };
    }

    await services.filesystem.ensureDirectoryExists(
      defaultNetworksSettingsPath,
    );

    const data = {
      name: network,
    };

    await services.filesystem.writeFile(
      defaultNetworksSettingsFilePath,
      yaml.dump(data),
    );

    return {
      status: 'success',
      data: {},
    };
  } catch (error) {
    return {
      status: 'error',
      errors: [error.message],
    };
  }
};

export const createNetworkSetDefaultCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'set-default',
  'Set default network from the list of available networks.',
  [
    networkOptions.networkSelectWithNone({ isOptional: false }),
    networkOptions.networkDefaultConfirmation({ isOptional: false }),
  ],
  async (option) => {
    const defaultNetworkName = await getDefaultNetworkName();
    const config = await option.network({
      defaultNetwork: defaultNetworkName,
    });

    log.debug('network-set-default:action', config);

    const { network, networkConfig } = config;

    if (network === 'none' && isEmpty(defaultNetworkName)) {
      log.warning(`There is no default network to remove.`);
      return;
    }

    if (!isNotEmptyObject(networkConfig) && network !== 'none') {
      log.warning(`The network configuration "${network}" does not exist.`);
      return;
    }

    const action = network === 'none' ? 'unset' : 'set';

    let networkName: string = network;
    let confirmationErrorMsg = 'The default network will not be set.';
    if (action === 'unset') {
      networkName = defaultNetworkName as string;
      confirmationErrorMsg = 'The default network will not be removed.';
    }

    const { confirm } = await option.confirm({
      action,
      network: networkName,
    });

    if (confirm === false) {
      log.warning(confirmationErrorMsg);
      return;
    }

    if (network === 'none') {
      await removeDefaultNetwork();
      log.info(
        log.color.green(`The default network configuration has been removed.`),
      );
      return;
    }

    const result = await setNetworkDefault(network);
    assertCommandError(result);

    log.info(
      log.color.green(
        `The network configuration "${config.network}" has been set as default.`,
      ),
    );
  },
);
