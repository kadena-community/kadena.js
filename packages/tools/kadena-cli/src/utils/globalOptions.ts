import { Option, program } from 'commander';
import { z } from 'zod';
import {
  account,
  devnet as devnetPrompts,
  generic,
  genericActionsPrompts,
  keys,
  networks,
  security,
  typescript,
} from '../prompts/index.js';

import type { ChainId } from '@kadena/types';
import chalk from 'chalk';
import { join } from 'node:path';
import {
  KEY_EXT,
  WALLET_DIR,
  WALLET_EXT,
  WALLET_LEGACY_EXT,
} from '../constants/config.js';
import { loadDevnetConfig } from '../devnet/utils/devnetHelpers.js';
import { getWallet, parseKeyIndexOrRange } from '../keys/utils/keysHelpers.js';
import { readKeyFileContent } from '../keys/utils/storage.js';
import {
  ensureNetworksConfiguration,
  loadNetworkConfig,
} from '../networks/utils/networkHelpers.js';
import { createExternalPrompt } from '../prompts/generic.js';
import { networkNamePrompt } from '../prompts/network.js';
import { createOption } from './createOption.js';
import { ensureDevnetsConfiguration } from './helpers.js';
import { removeAfterFirstDot } from './path.util.js';

// eslint-disable-next-line @rushstack/typedef-var
export const globalFlags = {
  quiet: new Option(
    '-q --quiet',
    'Disables interactive prompts and skips confirmations',
  ),
  legacy: new Option('-l, --legacy', 'Output legacy format'),
};

// eslint-disable-next-line @rushstack/typedef-var
export const globalOptions = {
  // Account
  accountName: createOption({
    key: 'accountName',
    prompt: account.accountNamePrompt,
    validation: z.string(),
    option: new Option('-a, --account-name <accountName>', 'Account name'),
  }),
  publicKeys: createOption({
    key: 'publicKeys',
    prompt: account.publicKeysPrompt,
    validation: z.string(),
    option: new Option(
      '-p, --public-keys <publicKeys>',
      'Public keys (comma separated)',
    ),
    expand: async (publicKeys: string) => {
      return publicKeys.split(',').map((value) => value.trim());
    },
  }),
  amount: createOption({
    key: 'amount',
    prompt: account.amountPrompt,
    validation: z
      .string({
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        invalid_type_error: 'Error: -a, --amount must be a number',
      })
      .min(0),
    option: new Option('-a, --amount <amount>', 'Amount'),
  }),
  fungible: createOption({
    key: 'fungible',
    prompt: account.fungiblePrompt,
    validation: z.string(),
    option: new Option('-f, --fungible <fungible>', 'Fungible'),
  }),
  predicate: createOption({
    key: 'predicate',
    prompt: account.predicatePrompt,
    validation: z.string(),
    option: new Option('-p, --predicate <predicate>', 'Keyset predicate'),
  }),
  // global
  quiet: createOption({
    key: 'quiet',
    prompt: ({ quiet }): boolean => quiet === true || quiet === 'true' || false,
    validation: z.boolean().optional(),
    option: globalFlags.quiet,
  }),
  legacy: createOption({
    key: 'legacy',
    prompt: ({ legacy }): boolean => {
      return legacy === true || legacy === 'true' || false;
    },
    validation: z.boolean().optional(),
    option: globalFlags.legacy,
  }),
  // security
  securityCurrentPassword: createOption({
    key: 'securityCurrentPassword',
    prompt: security.securityCurrentPasswordPrompt,
    validation: z.string(),
    option: new Option(
      '-scp, --security-current-password <securityCurrentPassword>',
      'Enter your current key password',
    ),
  }),
  securityNewPassword: createOption({
    key: 'securityNewPassword',
    prompt: security.securityNewPasswordPrompt,
    validation: z.string(),
    option: new Option(
      '-snp, --security-new-password <securityNewPassword>',
      'Enter your new key password',
    ),
  }),
  // Devnet
  devnet: createOption({
    key: 'devnet',
    prompt: devnetPrompts.devnetPrompt,
    validation: z.string(),
    option: new Option('-d, --devnet <devnet>', 'Devnet name'),
    expand: async (devnet: string) => {
      await ensureDevnetsConfiguration();
      try {
        return loadDevnetConfig(devnet);
      } catch (e) {
        console.log(
          chalk.yellow(
            `\nNo devnet "${devnet}" found. Please create the devnet.\n`,
          ),
        );
        await program.parseAsync(['', '', 'devnet', 'create']);
        const externalPrompt = createExternalPrompt({
          devnetPrompt: devnetPrompts.devnetPrompt,
        });
        const devnetName = await externalPrompt.devnetPrompt();
        return loadDevnetConfig(devnetName);
      }
    },
  }),
  devnetName: createOption({
    key: 'name',
    prompt: devnetPrompts.devnetNamePrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Devnet name (e.g. "devnet")'),
  }),
  devnetPort: createOption({
    key: 'port',
    prompt: devnetPrompts.devnetPortPrompt,
    validation: z.number(),
    option: new Option(
      '-p, --port <port>',
      'Port to forward to the Chainweb node API (e.g. 8080)',
    ).argParser((value) => parseInt(value, 10)),
  }),
  devnetUseVolume: createOption({
    key: 'useVolume',
    prompt: devnetPrompts.devnetUseVolumePrompt,
    validation: z.boolean(),
    option: new Option(
      '-u, --useVolume',
      'Create a persistent volume to mount to the container',
    ),
  }),
  devnetMountPactFolder: createOption({
    key: 'mountPactFolder',
    prompt: devnetPrompts.devnetMountPactFolderPrompt,
    validation: z.string(),
    option: new Option(
      '-m, --mountPactFolder <mountPactFolder>',
      'Mount a folder containing Pact files to the container (e.g. "./pact")',
    ),
  }),
  devnetSelect: createOption({
    key: 'name',
    prompt: devnetPrompts.devnetSelectPrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Devnet name'),
  }),
  devnetVersion: createOption({
    key: 'version',
    prompt: devnetPrompts.devnetVersionPrompt,
    validation: z.string(),
    option: new Option(
      '-v, --version <version>',
      'Version of the kadena/devnet Docker image to use (e.g. "latest")',
    ),
  }),
  // Network
  networkName: createOption({
    key: 'network',
    prompt: networks.networkNamePrompt,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
  }),
  networkId: createOption({
    key: 'networkId',
    prompt: networks.networkIdPrompt,
    validation: z.string(),
    option: new Option(
      '-nid, --network-id <networkId>',
      'Kadena network Id (e.g. "mainnet01")',
    ),
  }),
  networkHost: createOption({
    key: 'networkHost',
    prompt: networks.networkHostPrompt,
    validation: z.string(),
    option: new Option(
      '-h, --network-host <networkHost>',
      'Kadena network host (e.g. "https://api.chainweb.com")',
    ),
  }),
  networkExplorerUrl: createOption({
    key: 'networkExplorerUrl',
    prompt: networks.networkExplorerUrlPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-e, --network-explorer-url <networkExplorerUrl>',
      'Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    ),
  }),
  networkOverwrite: createOption({
    key: 'networkOverwrite',
    prompt: networks.networkOverwritePrompt,
    validation: z.string(),
    option: new Option(
      '-o, --network-overwrite <networkOverwrite>',
      'Overwrite existing network configuration (yes/no)',
    ),
  }),
  network: createOption({
    key: 'network',
    prompt: networks.networkSelectPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand: async (network: string) => {
      await ensureNetworksConfiguration();
      try {
        return loadNetworkConfig(network);
      } catch (e) {
        console.log(
          `\nNo configuration for network "${network}" found. Please configure the network.\n`,
        );
        await program.parseAsync(['', '', 'networks', 'create']);
        const externalPrompt = createExternalPrompt({
          networkNamePrompt,
        });
        const networkName = await externalPrompt.networkNamePrompt();
        return loadNetworkConfig(networkName);
      }
    },
  }),
  chainId: createOption({
    key: 'chainId',
    prompt: networks.chainIdPrompt,
    validation: z
      .string({
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        invalid_type_error: 'Error: -c, --chain-id must be a number',
      })
      .min(0)
      .max(19),
    option: new Option('-c, --chain-id <chainId>'),
    transform: (chainId: string) => {
      return chainId as ChainId;
    },
  }),

  // Keys
  keyAlias: createOption({
    key: 'keyAlias',
    prompt: keys.keyAliasPrompt,
    validation: z.string(),
    option: new Option(
      '-a, --key-alias <keyAlias>',
      'Enter an alias to store your key',
    ),
  }),
  keyWallet: createOption({
    key: 'keyWallet',
    prompt: keys.keyWallet,
    validation: z.string(),
    option: new Option(
      '-w, --key-wallet <keyWallet>',
      'Enter you wallet names',
    ),
  }),
  keyIndexOrRange: createOption({
    key: 'keyIndexOrRange',
    prompt: keys.keyIndexOrRangePrompt,
    validation: z.string(),
    option: new Option(
      '-r, --key-index-or-range <keyIndexOrRange>',
      'Enter the index or range of indices for key generation (e.g., 5 or 1-5). Default is 1',
    ),
    transform(value) {
      return parseKeyIndexOrRange(value);
    },
  }),
  keyAmount: createOption({
    key: 'keyAmount',
    prompt: keys.keyAmountPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --key-amount <keyAmount>',
      'Enter the number of key pairs you want to generate (default: 1)',
    ),
    transform: (keyAmount) => {
      const parsed = parseInt(keyAmount, 10);
      return isNaN(parsed) ? null : parsed;
    },
  }),
  keyGenFromChoice: createOption({
    key: 'keyGenFromChoice',
    prompt: keys.genFromChoicePrompt,
    validation: z.string(),
    option: new Option(
      '-c, --key-gen-from-choice <keyGenFromChoice>',
      'Choose an action for generating keys',
    ),
  }),
  keyWalletSelect: createOption({
    key: 'keyWallet',
    prompt: keys.keyWalletSelectPrompt,
    validation: z.string(),
    option: new Option('-w, --key-wallet <keyWallet>', 'Enter your wallet'),
    defaultIsOptional: false,
    transform: async (keyWallet) => {
      if (
        keyWallet.includes(WALLET_EXT) ||
        keyWallet.includes(WALLET_LEGACY_EXT)
      ) {
        return {
          wallet: await readKeyFileContent(
            join(WALLET_DIR, removeAfterFirstDot(keyWallet), keyWallet),
          ),
          fileName: keyWallet,
        };
      }
      return keyWallet;
    },
  }),
  keyWalletSelectWithAll: createOption({
    key: 'keyWallet',
    prompt: keys.keyWalletSelectAllPrompt,
    validation: z.string(),
    option: new Option('-w, --key-wallet <keyWallet>', 'Enter your wallet'),
    defaultIsOptional: false,
    expand: async (keyWallet) => {
      return await getWallet(keyWallet);
    },
  }),
  securityPassword: createOption({
    key: 'securityPassword',
    prompt: security.securityPasswordPrompt,
    validation: z.string(),
    option: new Option(
      '-p, --security-password <securityPassword>',
      'Enter a password to encrypt your key with',
    ),
  }),
  securityVerifyPassword: createOption({
    key: 'securityVerifyPassword',
    prompt: security.securityPasswordVerifyPrompt,
    validation: z.string(),
    option: new Option(
      '-p, --security-verify-password <securityVerifyPassword>',
      'Enter a password to verify with password',
    ),
  }),
  keyMnemonic: createOption({
    key: 'keyMnemonic',
    prompt: keys.keyMnemonicPrompt,
    validation: z.string(),
    option: new Option(
      '-m, --key-mnemonic <keyMnemonic>',
      'Enter your 12-word mnemonic phrase to generate keys from',
    ),
  }),
  keyUsePassword: createOption({
    key: 'keyUsePassword',
    prompt: genericActionsPrompts.actionAskForPassword,
    validation: z.string(),
    option: new Option(
      '-up, --key-use-password <keyUsePassword>',
      'Do you want to use a password to encrypt your key? (yes/no)',
    ),
  }),
  keyFilename: createOption({
    key: 'keyFilename',
    prompt: () => generic.genericFileNamePrompt('key'),
    validation: z.string(),
    option: new Option(
      '-f, --key-filename <keyFilename>',
      'Enter filename to store your key in',
    ),
  }),
  typescriptClean: createOption({
    key: 'typescriptClean',
    prompt: typescript.typescriptClean,
    validation: z.boolean(),
    option: new Option('--typescript-clean', 'Clean existing generated files'),
  }),
  typescriptCapsInterface: createOption({
    key: 'typescriptCapsInterface',
    prompt: typescript.typescriptCapsInterface,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-caps-interface <interface>',
      'Custom name for the interface of the caps. Can be used to create a type definition with a limited set of capabilities.',
    ),
  }),
  typescriptFile: createOption({
    key: 'typescriptFile',
    prompt: typescript.typescriptFile,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-file <file>',
      'Generate d.ts from Pact contract file(s) (comma separated)',
    ),
    expand: async (file: string) => {
      return file
        .split(',')
        .map((value) => value.trim())
        .filter((f) => f.length);
    },
  }),
  typescriptContract: createOption({
    key: 'typescriptContract',
    prompt: typescript.typescriptContract,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-contract <contractName>',
      'Generate d.ts from Pact contract(s) from the blockchain (comma separated)',
    ),
    expand: async (contracts: string) => {
      return contracts
        .split(',')
        .map((value) => value.trim())
        .filter((c) => c.length);
    },
  }),
  typescriptNamespace: createOption({
    key: 'typescriptNamespace',
    prompt: typescript.typescriptNamespace,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-namespace <string>',
      'use as the namespace of the contract if its not clear in the contract',
    ),
  }),
  key: createOption({
    key: 'key',
    prompt: keys.keyDeleteSelectPrompt,
    validation: z.string(),
    option: new Option('-k, --key <key>', 'Select key from keyfile'),
  }),
  keyMessage: createOption({
    key: 'keyMessage',
    prompt: keys.keyMessagePrompt,
    validation: z.string(),
    option: new Option(
      '-n, --key-message <keyMessage>',
      'Enter message to decrypt',
    ),
    transform: async (keyMessage: string) => {
      if (keyMessage.includes(WALLET_EXT) || keyMessage.includes(KEY_EXT)) {
        const keyFileContent = await readKeyFileContent(keyMessage);
        if (typeof keyFileContent === 'string') {
          return keyFileContent;
        }
        return keyFileContent?.secretKey;
      }
      return keyMessage;
    },
  }),
};

export type GlobalOptions = typeof globalOptions;
export type GlobalFlags = typeof globalFlags;
