import type { Command } from 'commander';

import ora from 'ora';
import { services } from '../../services/index.js';
import type { IWalletKey } from '../../services/wallet/wallet.types.js';
import { CommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import { createTable } from '../../utils/table.js';
import { walletOptions } from '../walletOptions.js';

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'generate-key',
  'Generate public/secret key pair(s) from your wallet',
  [
    globalOptions.walletSelect(),
    securityOptions.createPasswordOption({
      message: 'Enter the wallet password',
    }),
    walletOptions.amount(),
    walletOptions.startIndex({ disableQuestion: true }),
    walletOptions.keyAlias(),
  ],
  async (option) => {
    const { walletNameConfig, walletName } = await option.walletName();
    let wallet = walletNameConfig;
    if (!wallet) {
      throw new Error(`Wallet: ${walletName} does not exist.`);
    }

    const { passwordFile } = await option.passwordFile({ wallet });
    const { amount } = await option.amount();
    const { startIndex } = await option.startIndex();
    const { keyAlias } = await option.keyAlias();

    const loadingSpinner = ora('Generating keys..').start();

    const defaultStartIndex =
      Math.max(...wallet.keys.map((key) => key.index)) + 1;

    const keyAmount = Number(amount) || 1;
    const keys: IWalletKey[] = [];
    for (let i = 0; i < keyAmount; i++) {
      const key = await services.wallet
        .generateKey({
          index: (Number(startIndex) || defaultStartIndex) + i,
          legacy: wallet.legacy,
          password: passwordFile,
          seed: wallet.seed,
          alias: keyAlias,
        })
        .catch((error) => {
          throw new CommandError({
            errors: [
              `Something went wrong generating a new key, did you use the right password?`,
              error.message,
            ],
          });
        });
      wallet = await services.wallet.storeKey(wallet, key);
      keys.push(key);
    }

    loadingSpinner.succeed('Keys generated successfully');

    const table = createTable({ head: ['Public key', 'Index'] });
    table.push(...keys.map((key) => [key.publicKey, key.index.toString()]));
    log.output(table.toString(), keys);

    log.info();

    log.info(log.color.green('Wallet Storage Location'));
    log.info(relativeToCwd(wallet.filepath));
  },
);
