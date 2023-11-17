import { Option } from 'commander';
import { z } from 'zod';
import {
  // account,
  // contract,
  // devnet,
  generic,
  genericActionsPrompts,
  keys,
  // marmalade,
  networks,
  security,
} from '../prompts/index.js';

import { createOption } from './createOption.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PreviousQuestions = Record<string, string | number | object | any[]>;

// eslint-disable-next-line @rushstack/typedef-var
export const globalOptions = {
  // Networks
  networkName: createOption({
    key: 'network' as const,
    prompt: networks.networkNamePrompt,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
  }),
  networkId: createOption({
    key: 'networkId' as const,
    prompt: networks.networkIdPrompt,
    validation: z.string(),
    option: new Option(
      '-nid, --network-id <networkId>',
      'Kadena network Id (e.g. "mainnet01")',
    ),
  }),
  networkHost: createOption({
    key: 'networkHost' as const,
    prompt: networks.networkHostPrompt,
    validation: z.string(),
    option: new Option(
      '-h, --network-host <networkHost>',
      'Kadena network host (e.g. "https://api.chainweb.com")',
    ),
  }),
  networkExplorerUrl: createOption({
    key: 'networkExplorerUrl' as const,
    prompt: networks.networkExplorerUrlPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-e, --network-explorer-url <networkExplorerUrl>',
      'Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    ),
  }),
  networkNetwork: createOption({
    key: 'network' as const,
    prompt: networks.networkSelectPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand: async (network: string) => {},
  }),

  // Keys
  keyAlias: createOption({
    key: 'keyAlias' as const,
    prompt: keys.keyAlias,
    validation: z.string(),
    option: new Option(
      '-a, --key-alias <keyAlias>',
      'Enter an alias to store your key',
    ),
  }),
  keyAmount: createOption({
    key: 'keyAmount' as const,
    prompt: keys.keyAmount,
    validation: z.string(),
    option: new Option(
      '-n, --key-amount <keyAmount>',
      'Enter the number of key pairs you want to generate. (aliases can only be used when generating one key pair) (optional) (default: 1)',
    ),
  }),
  keyPassword: createOption({
    key: 'keyPassword' as const,
    prompt: (previousQuestions: PreviousQuestions = {}) => {
      for (const key in previousQuestions) {
        if (
          Object.prototype.hasOwnProperty.call(previousQuestions, key) &&
          previousQuestions[key] === 'no'
        ) {
          return Promise.resolve('');
        }
      }
      return security.securityPassword();
    },
    validation: z.string(),
    option: new Option(
      '-p, --key-password <keyPassword>',
      'Enter a password to encrypt your key with',
    ),
  }),
  keyUsePassword: createOption({
    key: 'keyUsePassword' as const,
    prompt: genericActionsPrompts.actionAskForPassword,
    validation: z.string(),
    option: new Option(
      '-up, --key-use-password <keyUsePassword>',
      'Do you want to use a password to encrypt your key? (yes/no)',
    ),
  }),
  keyFilename: createOption({
    key: 'keyFilename' as const,
    prompt: () => generic.genericFileName('key'),
    validation: z.string(),
    option: new Option(
      '-f, --key-filename <keyFilename>',
      'Enter filename to store your key in',
    ),
  }),

  // account: createOption({
  //   key: 'account' as const,
  //   prompt: accountPrompt,
  //   validation: z.string(),
  //   option: new Option('-k, --account <account>', 'Accout name'),
  //   expand: async (account: string) => {
  //     await ensureAccountsConfiguration();
  //     try {
  //       return loadAccountConfig(account);
  //     } catch (e) {
  //       console.log(
  //         chalk.yellow(
  //           `\nNo account "${account}" found. Please create the account.\n`,
  //         ),
  //       );
  //       await program.parseAsync(['', '', 'account', 'create']);
  //       const accountName = await accountPrompt();
  //       return loadAccountConfig(accountName);
  //     }
  //   },
  // }),
  // accountName: createOption({
  //   key: 'account' as const,
  //   prompt: accountNamePrompt,
  //   validation: z.string(),
  //   option: new Option(
  //     '-a, --account <account>',
  //     'Receiver (k:) wallet address',
  //   ),
  // }),
  // chainId: createOption({
  //   key: 'chainId' as const,
  //   prompt: chainIdPrompt,
  //   validation: z
  //     .string({
  //       /* eslint-disable-next-line @typescript-eslint/naming-convention */
  //       invalid_type_error: 'Error: -c, --chain-id must be a number',
  //     })
  //     .min(0)
  //     .max(19),
  //   option: new Option('-c, --chain-id <chainId>'),
  // }),
  // gasPayer: createOption({
  //   key: 'gasPayer' as const,
  //   prompt: gasPayerPrompt,
  //   validation: z.string(),
  //   option: new Option('-g, --gas-payer <gasPayer>', 'Gas payer account'),
  //   expand: async (gasPayer: string) => {
  //     await ensureAccountsConfiguration();
  //     try {
  //       return loadAccountConfig(gasPayer);
  //     } catch (e) {
  //       console.log(
  //         chalk.yellow(
  //           `\nNo account "${gasPayer}" found. Please create the account.\n`,
  //         ),
  //       );
  //       await program.parseAsync(['', '', 'account', 'create']);
  //       const accountName = await accountPrompt();
  //       return loadAccountConfig(accountName);
  //     }
  //   },
  // }),
  // plainKeyAmount: createOption({
  //   key: 'plainKeyAmount' as const,
  //   prompt: plainKeyAmount,
  //   validation: z.number(),
  //   option: new Option(
  //     '-n, --plainkeyAmount <plainkeyAmount>',
  //     'Enter the amount of key pairs you want to generate. (aliases can only be used when generating one key pair) (optional) (default: 1)',
  //   ),
  // }),
  // plainKeyAlias: createOption({
  //   key: 'plainKeyAlias' as const,
  //   prompt: plainKeyAlias,
  //   validation: z.string(),
  //   option: new Option(
  //     '-a, --plainkeyAlias <plainkeyAlias>',
  //     'Enter an alias to store the key pair under (optional)',
  //   ),
  // }),
  // keyset: createOption({
  //   key: 'keyset' as const,
  //   prompt: keysetPrompt,
  //   validation: z.string(),
  //   option: new Option('-k, --keyset <keyset>', 'Keyset name'),
  //   expand: async (keyset: string) => {
  //     await ensureKeysetsConfiguration();
  //     try {
  //       return loadKeysetConfig(keyset);
  //     } catch (e) {
  //       console.log(
  //         chalk.yellow(
  //           `\nNo keyset "${keyset}" found. Please create the keyset.\n`,
  //         ),
  //       );
  //       await program.parseAsync(['', '', 'keyset', 'create']);
  //       const keysetName = await keysetPrompt();
  //       return loadKeysetConfig(keysetName);
  //     }
  //   },
  // }),
  keysetName: createOption({
    key: 'name' as const,
    prompt: async () => {
      return await Promise.resolve('default');
    },
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Keyset name'),
  }),
  // keysetPredicate: createOption({
  //   key: 'predicate' as const,
  //   prompt: keysetPredicatePrompt,
  //   validation: z.string(),
  //   option: new Option('-p, --predicate <predicate>', 'Keyset predicate'),
  // }),
  // keysetSelect: createOption({
  //   key: 'name' as const,
  //   prompt: keysetSelectPrompt,
  //   validation: z.string(),
  //   option: new Option('-n, --name <name>', 'Keyset name'),
  // }),
  // network: createOption({
  //   key: 'network' as const,
  //   prompt: networkPrompt,
  //   validation: z.string(),
  //   option: new Option(
  //     '-n, --network <network>',
  //     'Kadena network (e.g. "mainnet")',
  //   ),
  //   expand: async (network: string) => {
  //     await ensureNetworksConfiguration();
  //     try {
  //       return loadNetworkConfig(network);
  //     } catch (e) {
  //       console.log(
  //         chalk.yellow(
  //           `\nNo configuration for network "${network}" found. Please configure the network.\n`,
  //         ),
  //       );
  //       await program.parseAsync(['', '', 'networks', 'create']);
  //       const networkName = await networkPrompt();
  //       return loadNetworkConfig(networkName);
  //     }
  //   },
  // }),
  // networkSelect: createOption({
  //   key: 'network' as const,
  //   prompt: networkSelectPrompt,
  //   validation: z.string(),
  //   option: new Option(
  //     '-n, --network <network>',
  //     'Kadena network (e.g. "mainnet")',
  //   ),
  // }),

  // otherPublicKeys: createOption({
  //   key: 'publicKeys' as const,
  //   prompt: publicKeysPrompt,
  //   validation: z.string().optional(),
  //   option: new Option(
  //     '-p, --public-keys <publicKeys>',
  //     'Public keys (comma separated)',
  //   ),
  //   expand: async (publicKeys: string) => {
  //     return publicKeys.split(',').map((value) => value.trim());
  //   },
  // }),
} as const;

export type GlobalOptions = typeof globalOptions;
