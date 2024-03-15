import { Command } from 'commander';
import path from 'node:path';
import {
  defaultNetworksPath,
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

    const defaultNetworkSettingsFilePath = path.join(
      defaultNetworksSettingsPath,
      '__default__.yaml',
    );

    const defaultNetworkAlreadyExists = await services.filesystem.fileExists(
      defaultNetworkSettingsFilePath,
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

    await services.filesystem.writeFile(
      defaultNetworkSettingsFilePath,
      network,
    );

    log.info(
      log.color.green(
        `\nThe network configuration "${config.network}" has been set as default.\n`,
      ),
    );
  },
);
