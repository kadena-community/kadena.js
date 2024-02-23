import path from 'path';

import { defaultDevnetsPath } from '../../constants/devnets.js';
import { devnetOverwritePrompt } from '../../prompts/devnet.js';
import { createExternalPrompt } from '../../prompts/generic.js';
import { services } from '../../services/index.js';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { writeDevnet } from '../utils/devnetHelpers.js';

export const createDevnetCommand: CreateCommandReturnType =
  createCommandFlexible(
    'create',
    'Create devnet',
    [
      globalOptions.devnetName(),
      globalOptions.devnetPort(),
      globalOptions.devnetUseVolume(),
      globalOptions.devnetMountPactFolder(),
      globalOptions.devnetVersion(),
    ],
    async (option, { collect }) => {
      // const tmp = await option.name();
      // const { name } = option;
      const config = await collect(option);

      console.log(config);
      // const devnetName = await option.name();
      // const devnetPort = await option.port();
      // const devnetUseVolume = await option.useVolume();
      // const devnetMountPactFolder = await option.mountPactFolder();
      // const devnetVersion = await option.version();
      // const config = {
      //   ...devnetName,
      //   ...devnetPort,
      //   ...devnetUseVolume,
      //   ...devnetMountPactFolder,
      //   ...devnetVersion,
      // };

      log.debug('devnet-create:action', { config });

      const filePath = path.join(defaultDevnetsPath, `${config.name}.yaml`);

      if (await services.filesystem.fileExists(filePath)) {
        const externalPrompt = createExternalPrompt({
          devnetOverwritePrompt,
        });
        const overwrite = await externalPrompt.devnetOverwritePrompt();
        if (overwrite === 'no') {
          log.warning(
            `\nThe existing devnet configuration "${config.name}" will not be updated.\n`,
          );
          return;
        }
      }

      await writeDevnet(config);

      log.info(
        log.color.green(
          `\nThe devnet configuration "${config.name}" has been saved.\n`,
        ),
      );
    },
  );
