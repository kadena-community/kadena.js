import type { Command } from 'commander';

import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { keysOptions } from '../keysOptions.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';

const defaultAmount: number = 1;

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'generate',
  'Generate random public/secret key pair(s)',
  [
    globalOptions.keyAlias({ isOptional: false }),
    keysOptions.keyAmount({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('generate-plain:action', config);

    const amount =
      config.keyAmount !== undefined && config.keyAmount !== null
        ? config.keyAmount
        : defaultAmount;

    const keyPairs = await services.plainKey.generateKeyPairs(
      amount,
      config.legacy,
    );
    const result = await services.plainKey.storeKeyPairs(
      keyPairs,
      config.keyAlias,
    );

    for (const warning of result.warnings) {
      log.warning(warning);
    }

    displayGeneratedPlainKeys(result.keys);
    printStoredPlainKeys(result.keys);
  },
);
