import { createAccount, createPrincipalAccount, createPrincipalCommand } from '@kadena/client-utils/coin';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';
import chalk from 'chalk';
import { ChainId, createSignWithKeypair } from '@kadena/client';
import { writeAccount } from './accountHelpers.js';
import { loadKeysetConfig } from '../keyset/keysetHelpers.js';
import { loadKeypairConfig } from '../keypair/keypairHelpers.js';

// eslint-disable-next-line @rushstack/typedef-var
export const createAccountCommand = createCommand(
  'create',
  'Create account',
  [globalOptions.accountName(), globalOptions.keyset(), globalOptions.network(), globalOptions.chainId(), globalOptions.gasPayer()],
  async (config) => {
    try {
      const publicKeys = config.keysetConfig.publicKeys.split(',').map(value => value.trim()).filter(value => value.length);
      for (let keypair of config.keysetConfig.publicKeysFromKeypairs) {
        const keypairConfig = await loadKeypairConfig(keypair)
        publicKeys.push(keypairConfig.publicKey || '');
      }

      const createPrincipal = await createPrincipalCommand({
        keyset: {
          pred: config.keysetConfig.predicate as 'keys-all' | 'keys-two' | 'keys-one',
          keys: publicKeys,
        },
        gasPayer: { account: 'dummy', publicKeys: [] },
        chainId: config.chainId as ChainId,
      },
      {
        host: config.networkConfig.networkHost,
        defaults: {
          networkId: config.networkConfig.networkId,
          meta: {
            chainId: config.chainId as ChainId,
          }
        },
      });

      const account = await createPrincipal().execute();

      writeAccount({
        ...config,
        name: config.account,
        account: account as string,
      });

      console.log(chalk.green(`\nSaved the account configuration "${config.account}".\n`));

      // @todo: make gas payer configuration more flexible.
      const gasPayerKeyset = await loadKeysetConfig(config.gasPayerConfig.keyset);
      // @todo: now it is simply assumed that the gas payer account is governed with a keypair
      const gasPayerKeypair = await loadKeypairConfig(gasPayerKeyset.publicKeysFromKeypairs.pop() || '');

      // @todo: also allow other signing methods
      const signWithKeyPair = createSignWithKeypair({
        publicKey: gasPayerKeypair.publicKey,
        secretKey: gasPayerKeypair.secretKey,
      });

      const c = await createPrincipalAccount(
        {
          keyset: {
            pred: 'keys-all',
            keys: ['1827389ca64cb5c3c77352eb2087c2bb503061d22fb1edcadb5d90ad1dee80f5'],
          },
          gasPayer: { account: 'sender00', publicKeys: [gasPayerKeypair.publicKey] },
          chainId: config.chainId as ChainId,
        },
        {
          host: config.networkConfig.networkHost,
          defaults: {
            networkId: config.networkConfig.networkId,
            meta: {
              chainId: config.chainId as ChainId,
            }
          },
          sign: signWithKeyPair,
        },
      )

      const result = await c.execute();

      console.log(result);

      if (result === 'Write succeeded') {
        console.log(chalk.green(`\nCreated account "${account}" guarded by keyset "${config.keyset}" on chain ${config.chainId} of "${config.network}".\n`));
      } else {
        console.log(chalk.red(`\nFailed to created the account on "${config.network}".\n`));
      }
    } catch (e) {
      console.log(chalk.red(e.message));
    }
  },
);
