import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer } from '@kadena/client-utils/coin';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { FAUCET_CONSTANTS } from '../../constants/faucet.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const fundCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'fund',
  'fund account',
  [
    globalOptions.accountName(),
    globalOptions.amount(),
    globalOptions.fungible(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (config) => {
    debug('account-fund:action')({ config });

    const signWithKeyPair = createSignWithKeypair({
      publicKey: FAUCET_CONSTANTS.devnetKp.publicKey,
      secretKey: FAUCET_CONSTANTS.devnetKp.secretKey,
    });

    const result = await transfer(
      {
        sender: {
          account: FAUCET_CONSTANTS.devnetAcct,
          publicKeys: [FAUCET_CONSTANTS.devnetKp.publicKey],
        },
        receiver: config.accountName,
        gasPayer: {
          account: FAUCET_CONSTANTS.devnetAcct,
          publicKeys: [FAUCET_CONSTANTS.devnetKp.publicKey],
        },
        chainId: config.chainId as ChainId,
        amount: config.amount,
        contract: config.fungible,
      },
      {
        host: config.networkConfig.networkHost,
        defaults: {
          networkId: config.networkConfig.networkId,
          meta: {
            chainId: config.chainId as ChainId,
          },
        },
        sign: signWithKeyPair,
      },
    ).execute();

    if (result === 'Write succeeded') {
      console.log(
        chalk.green(
          `\nFunded the account "${config.accountName}" on chain ${config.chainId} of "${config.network}".\n`,
        ),
      );
    } else {
      console.log(
        chalk.red(
          `\nFailed to fund the account on "${config.network}".\n`,
        ),
      );
    }
  },
);
