import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import { kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair } from '@kadena/hd-wallet/chainweaver';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import * as storageService from '../utils/storage.js';

import ora from 'ora';
import { displayStoredWallet } from '../utils/keysDisplay.js';

export const createImportWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'import-wallet',
  'import (restore) wallet from mnemonic phrase',
  [
    globalOptions.keyMnemonic(),
    globalOptions.securityNewPassword(),
    globalOptions.keyWallet(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('import-wallet:action')({ config });

      const loading = ora('Generating..').start();
      try {
        let keySeed: EncryptedString | undefined;

        if (config.legacy === true) {
          keySeed = await legacykadenaMnemonicToRootKeypair(
            config.securityNewPassword,
            config.keyMnemonic,
          );
        } else {
          keySeed = await kadenaMnemonicToSeed(
            config.securityNewPassword,
            config.keyMnemonic,
          );
        }

        loading.succeed('Completed');

        storageService.storeWallet(keySeed, config.keyWallet, config.legacy);

        displayStoredWallet(config.keyWallet, config.legacy);
      } catch (error) {
        loading.fail('Operation failed');
        console.error(
          `Error: ${error instanceof Error ? error.message : error}`,
        );
      }
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
