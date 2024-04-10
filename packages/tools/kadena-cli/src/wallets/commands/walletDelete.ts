import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';

import { services } from '../../services/index.js';
import { CommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { log } from '../../utils/logger.js';
import { input } from '../../utils/prompts.js';
import { walletOptions } from '../walletOptions.js';

const walletNameSelectWithAll = walletOptions.walletNameSelectWithAll();

const confirmDelete = createOption({
  key: 'confirm',
  defaultIsOptional: false,
  async prompt(args) {
    if (typeof args.walletName !== 'string') return false;
    const walletConfig = await walletNameSelectWithAll.expand(args.walletName);
    if (walletConfig === null) return false;

    if (Array.isArray(walletConfig)) {
      const message =
        `Are you sure you want to delete the following wallets:\n` +
        `${walletConfig
          .map(
            (wallet) =>
              `  - ${wallet.alias} with ${wallet.keys.length} key${
                wallet.keys.length > 1 ? 's' : ''
              }`,
          )
          .join(
            '\n',
          )}\n type "yes" to confirm or "no" to cancel and press enter. \n`;

      const answer = await input({
        message: message,
        validate: (input) => {
          if (input === 'yes' || input === 'no') {
            return true;
          }
          return 'Please type "yes" to confirm or "no" to cancel and press enter';
        },
      });

      return answer === 'yes';
    } else {
      const message =
        `Are you sure you want to delete the wallet:\n` +
        `${`  - ${walletConfig.alias} with ${walletConfig.keys.length} key${
          walletConfig.keys.length > 1 ? 's' : ''
        }`}\n type "yes" to confirm or "no" to cancel and press enter. \n`;

      const answer = await input({
        message: message,
        validate: (input) => {
          if (input === 'yes' || input === 'no') {
            return true;
          }
          return 'Please type "yes" to confirm or "no" to cancel.';
        },
      });
      return answer === 'yes';
    }
  },
  validation: z.boolean(),
  option: new Option('--confirm', 'Confirm wallet deletion'),
});

export const createDeleteWalletsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete',
  'Delete wallet from your filesystem',
  [walletOptions.walletNameSelectWithAll(), confirmDelete()],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('delete-wallet:action', config);

    if (config.confirm !== true) {
      log.warning('\nNo wallets were deleted.\n');
      return;
    }

    if (config.walletNameConfig === null) {
      throw new CommandError({
        errors: [`Wallet: ${config.walletName} does not exist.`],
        exitCode: 1,
      });
    }

    if (Array.isArray(config.walletNameConfig)) {
      for (const wallet of config.walletNameConfig) {
        await services.wallet.delete(wallet.filepath);
        log.info(
          log.color.green(
            `The wallet: "${wallet.alias}" and associated keys have been deleted.`,
          ),
        );
      }
      return;
    }

    await services.wallet.delete(config.walletNameConfig.filepath);
    log.info(
      log.color.green(
        `The wallet: "${config.walletNameConfig.alias}" and associated keys have been deleted.`,
      ),
    );
  },
);
