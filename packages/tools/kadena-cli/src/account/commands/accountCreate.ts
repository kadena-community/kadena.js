import { createSignWithKeypair } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { createAccount } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { FAUCET_CONSTANTS } from '../../constants/faucet.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const createAccountCommand: (program: Command, version: string) => void =
  createCommand(
    'create',
    'Create account',
    [
      globalOptions.fungible(),
      globalOptions.network(),
      globalOptions.chainId(),
      globalOptions.publicKeys(),
      globalOptions.predicate(),
    ],
    async (config) => {
      debug('account-create:action')({ config });

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

        const result = await createAccount(
          {
            account: principal as string,
            keyset: {
              pred: config.predicate as 'keys-all' | 'keys-2' | 'keys-any',
              keys: config.publicKeysConfig,
            },
            gasPayer: {
              account: FAUCET_CONSTANTS.devnetAcct,
              publicKeys: [FAUCET_CONSTANTS.devnetKp.publicKey],
            },
            chainId: config.chainId as ChainId,
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
              `\nCreated account "${principal}" on chain ${config.chainId} of "${config.network}".\n`,
            ),
          );
        } else {
          console.log(
            chalk.red(
              `\nFailed to create the account on "${config.network}".\n`,
            ),
          );
        }
      } catch (e) {
        console.log(chalk.red(e.message));
      }
    },
  );
