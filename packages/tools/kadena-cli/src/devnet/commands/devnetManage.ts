import { devnetOverwritePrompt } from '../../prompts/devnet.js';
import { writeDevnet } from '../utils/devnetHelpers.js';

import { createExternalPrompt } from '../../prompts/generic.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { devnetOptions } from '../devnetOptions.js';

export const manageDevnetsCommand = createCommand(
  'manage',
  'Manage devnets',
  [
    devnetOptions.devnetSelect(),
    devnetOptions.devnetPort(),
    devnetOptions.devnetUseVolume(),
    devnetOptions.devnetMountPactFolder(),
    devnetOptions.devnetVersion(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('devnet-manage:action', config);

    const externalPrompt = createExternalPrompt({
      devnetOverwritePrompt,
    });
    const overwrite = await externalPrompt.devnetOverwritePrompt();

    if (overwrite === 'no') {
      log.warning(
        `\nThe devnet configuration "${config.name}" will not be updated.\n`,
      );
      return;
    }

    await writeDevnet(config);

    log.info(
      log.color.green(
        `\nThe devnet configuration "${config.name}" has been updated.\n`,
      ),
    );
  },
);
