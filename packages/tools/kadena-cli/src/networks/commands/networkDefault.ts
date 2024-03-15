import { Command } from 'commander';
import yaml from 'js-yaml';
import path from 'node:path';
import {
  defaultNetworksPath,
  defaultNetworksSettingsFilePath,
  defaultNetworksSettingsPath,
} from '../../constants/networks.js';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { networkOptions } from '../networkOptions.js';

export const createNetworkSetDefaultCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'set-default',
  'Set default network configuration',
  [
    globalOptions.networkSelect({ isOptional: false }),
    networkOptions.networkDefaultConfirmation({
      isOptional: true,
    }),
  ],
  async (option) => {
    const config = await option.network();
    log.debug('network-set-default:action', config);

    const { network } = config;

    const filePath = path.join(defaultNetworksPath, `${network}.yaml`);
    if (!(await services.filesystem.fileExists(filePath))) {
      log.warning(
        `\nThe network configuration "${config.network}" does not exist.\n`,
      );
      return;
    }

    const defaultNetworkAlreadyExists = await services.filesystem.fileExists(
      defaultNetworksSettingsFilePath,
    );

    if (defaultNetworkAlreadyExists) {
      const { networkDefaultConfirmation } =
        await option.networkDefaultConfirmation();
      if (!networkDefaultConfirmation) {
        log.warning(
          `\nThe default network configuration will not be updated.\n`,
        );
        return;
      }
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

    log.info(
      log.color.green(
        `\nThe network configuration "${config.network}" has been set as default.\n`,
      ),
    );
  },
);
