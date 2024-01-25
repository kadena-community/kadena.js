import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { transferCreate } from '@kadena/client-utils/coin';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { FAUCET_CONSTANTS } from '../../constants/faucet.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const transferCreateCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'transfer-create',
  'Create and fund account',
  [
    globalOptions.amount(),
    globalOptions.fungible(),
    globalOptions.network(),
    globalOptions.chainId(),
    globalOptions.publicKeys(),
    globalOptions.predicate(),
  ],
  async (config) => {
    debug('account-transfer-create:action')({ config });

    try {
      const principal = await createPrincipal(
        {
          keyset: {
            pred: config.predicate as 'keys-all' | 'keys-2' | 'keys-any',
            keys: config.publicKeysConfig,
          },
        },
        {
          host: config.networkConfig.networkHost,
          defaults: {
            networkId: config.networkConfig.networkId,
            meta: {
              chainId: config.chainId as ChainId,
            },
          },
        },
      );

      const signWithKeyPair = createSignWithKeypair({
        publicKey: FAUCET_CONSTANTS.devnetKp.publicKey,
        secretKey: FAUCET_CONSTANTS.devnetKp.secretKey,
      });

      const result = await transferCreate(
        {
          sender: {
            account: FAUCET_CONSTANTS.devnetAcct,
            publicKeys: [FAUCET_CONSTANTS.devnetKp.publicKey],
          },
          receiver: {
            account: principal,
            keyset: {
              pred: config.predicate as 'keys-all' | 'keys-2' | 'keys-any',
              keys: config.publicKeysConfig,
            },
          },
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
            `\nFunded the account "${principal}" on chain ${config.chainId} of "${config.network}".\n`,
          ),
        );
      } else {
        console.log(
          chalk.red(
            `\nFailed to create and fund the account on "${config.network}".\n`,
          ),
        );
      }
    } catch (e) {
      console.log(chalk.red(e.message));
    }
  },
);
