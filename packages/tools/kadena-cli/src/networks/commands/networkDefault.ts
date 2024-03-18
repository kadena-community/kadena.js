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
import { globalOptions } from '../../utils/globalOptions.js';
import { isNotEmptyObject } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { networkOptions } from '../networkOptions.js';

export const setNetworkDefault = async (
  network: string,
): Promise<CommandResult<{}>> => {
  try {
    const filePath = path.join(defaultNetworksPath, `${network}.yaml`);

    if (!(await services.filesystem.fileExists(filePath))) {
      return {
        success: false,
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
      success: true,
      data: {},
    };
  } catch (error) {
    return {
      success: false,
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
    globalOptions.network({ isOptional: false }),
    networkOptions.networkDefaultConfirmation({ isOptional: false }),
  ],
  async (option) => {
    const config = await option.network();
    log.debug('network-set-default:action', config);

    const { network, networkConfig } = config;

    if (!isNotEmptyObject(networkConfig)) {
      log.warning(`The network configuration "${network}" does not exist.`);
      return;
    }

    const { networkDefaultConfirmation } =
      await option.networkDefaultConfirmation();

    if (!networkDefaultConfirmation) {
      log.warning(`The default network will not be set.`);
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
