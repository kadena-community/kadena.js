import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';
import { kadenaChangePassword } from '@kadena/hd-wallet/chainweaver';

import { createExternalPrompt } from '../../prompts/generic.js';
import { actionAskForUpdatePassword } from '../../prompts/genericActionPrompts.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { clearCLI } from '../../utils/helpers.js';
import * as storageService from '../utils/storage.js';

export const createManageKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'update-seed-password',
  'update seed password',
  [
    globalOptions.keySeedSelect(),
    globalOptions.securityCurrentPassword(),
    globalOptions.securityNewPassword(),
  ],
  async (config) => {
    try {
      clearCLI();
      debug('manage-keys:action')({ config });
      const { keySeed: data } = config;
      const { seed: keySeed, fileName } = data;

      console.log(
        chalk.yellow(`\nYou are about to update the password for this seed.\n`),
      );

      const isLegacy =
        kadenaDecrypt(config.securityCurrentPassword, keySeed).byteLength >=
        128;

      const externalPrompt = createExternalPrompt({
        actionAskForUpdatePassword,
      });
      const result = await externalPrompt.actionAskForUpdatePassword();

      if (result === 'no') {
        console.log(chalk.red(`\nSeed password won't be updated. Exiting..\n`));
        process.exit(0);
      }

      let encryptedNewSeed;
      const decryptedCurrentSeed = kadenaDecrypt(
        config.securityCurrentPassword,
        keySeed,
      );

      if (isLegacy === true) {
        const newSeed = await kadenaChangePassword(
          decryptedCurrentSeed,
          config.securityCurrentPassword,
          config.securityNewPassword,
        );
        encryptedNewSeed = kadenaEncrypt(config.securityNewPassword, newSeed);
      } else {
        encryptedNewSeed = kadenaEncrypt(
          config.securityNewPassword,
          decryptedCurrentSeed,
        );
      }

      console.log(chalk.green(`\nSeed password successfully updated..\n`));

      storageService.storeSeedByAlias(
        encryptedNewSeed,
        fileName.replace(/\.enc.*/, ''),
        isLegacy,
      );
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
