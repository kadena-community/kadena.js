import type { Command } from 'commander';
import yaml from 'js-yaml';
import path from 'node:path';
import {
  defaultNetworksPath,
  defaultNetworksSettingsFilePath,
  defaultNetworksSettingsPath,
} from '../../constants/networks.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { isNotEmptyObject } from '../../utils/helpers.js';
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
    const config = await option.network();
    log.debug('network-set-default:action', config);

    const { network, networkConfig } = config;

    if (network === 'none') {
      if (
        !(await services.filesystem.fileExists(defaultNetworksSettingsFilePath))
      ) {
        log.warning(`There is no default network to remove.`);
        return;
      }
    }

    if (!isNotEmptyObject(networkConfig) && network !== 'none') {
      log.warning(`The network configuration "${network}" does not exist.`);
      return;
    }

    const action = network === 'none' ? 'unset' : 'set';

    const { networkDefaultConfirmation } =
      await option.networkDefaultConfirmation({
        action,
      });
    if (networkDefaultConfirmation === false) {
      log.warning(`The default network will not be ${action}.`);
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
