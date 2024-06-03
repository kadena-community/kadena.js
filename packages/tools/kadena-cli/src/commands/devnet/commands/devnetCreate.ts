import path from 'path';

import { defaultDevnetsPath } from '../../../constants/devnets.js';
import { devnetOverwritePrompt } from '../../../prompts/devnet.js';
import { createExternalPrompt } from '../../../prompts/generic.js';
import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { log } from '../../../utils/logger.js';
import { devnetOptions } from '../devnetOptions.js';
import { writeDevnet } from '../utils/devnetHelpers.js';

export const createDevnetCommand = createCommand(
  'create',
  'Create devnet',
  [
    devnetOptions.devnetName(),
    devnetOptions.devnetPort(),
    devnetOptions.devnetUseVolume(),
    devnetOptions.devnetMountPactFolder(),
    devnetOptions.devnetVersion(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);

    log.debug('devnet-create:action', config);

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
