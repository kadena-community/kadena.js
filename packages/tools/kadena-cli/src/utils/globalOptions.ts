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
  tx,
  typescript,
} from '../prompts/index.js';

import type { ChainId } from '@kadena/types';
import chalk from 'chalk';
import { join } from 'node:path';

import {
  KEY_EXT,
  TRANSACTION_FOLDER_NAME,
  WALLET_EXT,
} from '../constants/config.js';
import { loadDevnetConfig } from '../devnet/utils/devnetHelpers.js';
import {
  getWallet,
  parseKeyIndexOrRange,
  parseKeyPairsInput,
} from '../keys/utils/keysHelpers.js';
import { readKeyFileContent } from '../keys/utils/storage.js';
import {
  ensureNetworksConfiguration,
  loadNetworkConfig,
} from '../networks/utils/networkHelpers.js';
import { createExternalPrompt } from '../prompts/generic.js';
import { networkNamePrompt } from '../prompts/network.js';
import { templateVariables } from '../prompts/tx.js';
import { services } from '../services/index.js';
import { defaultTemplates } from '../tx/commands/templates/templates.js';
import { getTemplateVariables } from '../tx/utils/template.js';
import { createOption } from './createOption.js';
import { ensureDevnetsConfiguration } from './helpers.js';

// eslint-disable-next-line @rushstack/typedef-var
export const globalFlags = {
  quiet: new Option(
    '-q --quiet',
    'Disables interactive prompts and skips confirmations',
  ),
  legacy: new Option('-l, --legacy', 'Output legacy format'),
} as const;

// eslint-disable-next-line @rushstack/typedef-var
export const globalOptions = {
  // Account
  accountName: createOption({
    key: 'accountName' as const,
    prompt: account.accountNamePrompt,
    validation: z.string(),
    option: new Option('-a, --account-name <accountName>', 'Account name'),
  }),
  publicKeys: createOption({
    key: 'publicKeys' as const,
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
    key: 'amount' as const,
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
    key: 'fungible' as const,
    prompt: account.fungiblePrompt,
    validation: z.string(),
    option: new Option('-f, --fungible <fungible>', 'Fungible'),
  }),
  predicate: createOption({
    key: 'predicate' as const,
    prompt: account.predicatePrompt,
    validation: z.string(),
    option: new Option('-p, --predicate <predicate>', 'Keyset predicate'),
  }),
  // global
  quiet: createOption({
    key: 'quiet' as const,
    // quiet is never prompted
    prompt: () => false,
    validation: z.boolean().optional(),
    option: globalFlags.quiet,
  }),
  legacy: createOption({
    key: 'legacy' as const,
    prompt: ({ legacy }): boolean => {
      return legacy === true || legacy === 'true' || false;
    },
    validation: z.boolean().optional(),
    option: globalFlags.legacy,
  }),
  // security
  securityCurrentPassword: createOption({
    key: 'securityCurrentPassword' as const,
    prompt: security.securityCurrentPasswordPrompt,
    validation: z.string(),
    option: new Option(
      '-c, --security-current-password <securityCurrentPassword>',
      'Enter your current key password',
    ),
  }),
  securityNewPassword: createOption({
    key: 'securityNewPassword' as const,
    prompt: security.securityNewPasswordPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --security-new-password <securityNewPassword>',
      'Enter your new key password',
    ),
  }),
  // Devnet
  devnet: createOption({
    key: 'devnet' as const,
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
    key: 'name' as const,
    prompt: devnetPrompts.devnetNamePrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Devnet name (e.g. "devnet")'),
  }),
  devnetPort: createOption({
    key: 'port' as const,
    prompt: devnetPrompts.devnetPortPrompt,
    validation: z.number(),
    option: new Option(
      '-p, --port <port>',
      'Port to forward to the Chainweb node API (e.g. 8080)',
    ).argParser((value) => parseInt(value, 10)),
  }),
  devnetUseVolume: createOption({
    key: 'useVolume' as const,
    prompt: devnetPrompts.devnetUseVolumePrompt,
    validation: z.boolean(),
    option: new Option(
      '-u, --useVolume',
      'Create a persistent volume to mount to the container',
    ),
  }),
  devnetMountPactFolder: createOption({
    key: 'mountPactFolder' as const,
    prompt: devnetPrompts.devnetMountPactFolderPrompt,
    validation: z.string(),
    option: new Option(
      '-m, --mountPactFolder <mountPactFolder>',
      'Mount a folder containing Pact files to the container (e.g. "./pact")',
    ),
  }),
  devnetSelect: createOption({
    key: 'name' as const,
    prompt: devnetPrompts.devnetSelectPrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Devnet name'),
  }),
  devnetVersion: createOption({
    key: 'version' as const,
    prompt: devnetPrompts.devnetVersionPrompt,
    validation: z.string(),
    option: new Option(
      '-v, --version <version>',
      'Version of the kadena/devnet Docker image to use (e.g. "latest")',
    ),
  }),
  // Network
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
  networkOverwrite: createOption({
    key: 'networkOverwrite' as const,
    prompt: networks.networkOverwritePrompt,
    validation: z.string(),
    option: new Option(
      '-o, --network-overwrite <networkOverwrite>',
      'Overwrite existing network configuration (yes/no)',
    ),
  }),
  network: createOption({
    key: 'network' as const,
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
    key: 'chainId' as const,
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
  keyPairs: createOption({
    key: 'keyPairs',
    prompt: keys.keyPairsPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --key-pairs <keyPairs>',
      'Enter key pairs as a JSON string [{publicKey: xxx, secretKey: xxx}, ...] or as a string publicKey=xxx,secretKey=xxx;...',
    ),
    transform: (input) => {
      try {
        return parseKeyPairsInput(input);
      } catch (error) {
        throw new Error(`Error parsing key pairs: ${error.message}`);
      }
    },
  }),
  keyPublicKey: createOption({
    key: 'keyPublicKey' as const,
    prompt: keys.keyPublicKeyPrompt,
    validation: z.string(),
    option: new Option(
      '-p, --key-public-key <keyPublicKey>',
      'Enter a public key',
    ),
  }),
  keySecretKey: createOption({
    key: 'keySecretKey' as const,
    prompt: keys.keySecretKeyPrompt,
    validation: z.string(),
    option: new Option(
      '-s, --key-secret-key <keySecretKey>',
      'Enter a secret key',
    ),
  }),
  keyAlias: createOption({
    key: 'keyAlias',
    prompt: keys.keyAliasPrompt,
    validation: z.string(),
    option: new Option(
      '-a, --key-alias <keyAlias>',
      'Enter an alias to store your key',
    ),
  }),
  keyAliasSelect: createOption({
    key: 'keyAliasSelect',
    prompt: keys.keyGetAllKeyFilesPrompt,
    validation: z.string(),
    option: new Option(
      '-a, --key-alias-select <keyAliasSelect>',
      'Enter a alias to select keys from',
    ),
  }),
  keyWallet: createOption({
    key: 'keyWallet' as const,
    prompt: keys.keyWallet,
    validation: z.string(),
    option: new Option(
      '-w, --key-wallet <keyWallet>',
      'Enter you wallet names',
    ),
  }),
  keyIndexOrRange: createOption({
    key: 'keyIndexOrRange' as const,
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
    key: 'keyAmount' as const,
    prompt: keys.keyAmountPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --key-amount <keyAmount>',
      'Enter the number of key pairs you want to generate (default: 1)',
    ),
    transform: (keyAmount: string) => {
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
    expand: async (keyWallet: string) => {
      return await getWallet(keyWallet);
    },
  }),
  keyWalletSelectWithAll: createOption({
    key: 'keyWallet',
    prompt: keys.keyWalletSelectAllPrompt,
    validation: z.string(),
    option: new Option('-w, --key-wallet <keyWallet>', 'Enter your wallet'),
    defaultIsOptional: false,
    expand: async (keyWallet: string) => {
      return keyWallet === 'all' ? null : await getWallet(keyWallet);
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
    key: 'securityVerifyPassword' as const,
    prompt: security.securityPasswordVerifyPrompt,
    validation: z.string(),
    option: new Option(
      '-p, --security-verify-password <securityVerifyPassword>',
      'Enter a password to verify with password',
    ),
  }),
  keyMnemonic: createOption({
    key: 'keyMnemonic' as const,
    prompt: keys.keyMnemonicPrompt,
    validation: z.string(),
    option: new Option(
      '-m, --key-mnemonic <keyMnemonic>',
      'Enter your 12-word mnemonic phrase to generate keys from',
    ),
  }),
  keyUsePassword: createOption({
    key: 'keyUsePassword' as const,
    prompt: genericActionsPrompts.actionAskForPassword,
    validation: z.string(),
    option: new Option(
      '-u, --key-use-password <keyUsePassword>',
      'Do you want to use a password to encrypt your key? (yes/no)',
    ),
  }),
  keyFilename: createOption({
    key: 'keyFilename' as const,
    prompt: () => generic.genericFileNamePrompt('key'),
    validation: z.string(),
    option: new Option(
      '-f, --key-filename <keyFilename>',
      'Enter filename to store your key in',
    ),
  }),
  typescriptClean: createOption({
    key: 'typescriptClean' as const,
    prompt: typescript.typescriptClean,
    validation: z.boolean(),
    option: new Option('--typescript-clean', 'Clean existing generated files'),
  }),
  typescriptCapsInterface: createOption({
    key: 'typescriptCapsInterface' as const,
    prompt: typescript.typescriptCapsInterface,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-caps-interface <interface>',
      'Custom name for the interface of the caps. Can be used to create a type definition with a limited set of capabilities.',
    ),
  }),
  typescriptFile: createOption({
    key: 'typescriptFile' as const,
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
    key: 'typescriptContract' as const,
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
    key: 'typescriptNamespace' as const,
    prompt: typescript.typescriptNamespace,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-namespace <string>',
      'use as the namespace of the contract if its not clear in the contract',
    ),
  }),
  keyMessage: createOption({
    key: 'keyMessage' as const,
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

  txUnsignedCommand: createOption({
    key: 'txUnsignedCommand',
    prompt: tx.txUnsignedCommandPrompt,
    validation: tx.IUnsignedCommandSchema,
    option: new Option(
      '-m, --tx-unsigned-command <txUnsignedCommand>',
      'enter your unsigned command to sign',
    ),
  }),
  txUnsignedTransactionFile: createOption({
    key: 'txUnsignedTransactionFile',
    prompt: tx.transactionSelectPrompt,
    validation: z.string(),
    option: new Option(
      '-u, --tx-unsigned-transaction-file <txUnsignedTransactionFile>',
      'provide your unsigned transaction file to sign',
    ),
  }),
  txUnsignedTransactionFiles: createOption({
    key: 'txUnsignedTransactionFiles',
    prompt: tx.transactionsSelectPrompt,
    validation: z.array(z.string()),
    option: new Option(
      '-u, --tx-unsigned-transaction-files <txUnsignedTransactionFiles>',
      'provide your unsigned transaction file(s) to sign',
    ),
  }),
  txSignedTransactionFile: createOption({
    key: 'txSignedTransactionFile',
    prompt: tx.transactionSelectPrompt,
    validation: tx.ICommandSchema,
    option: new Option(
      '-s, --tx-signed-transaction-file <txSignedTransactionFile>',
      'provide your signed transaction file',
    ),
  }),
  txSignedTransactionFiles: createOption({
    key: 'txSignedTransactionFiles',
    prompt: tx.transactionsSelectPrompt,
    validation: tx.ICommandSchema,
    option: new Option(
      '-s, --tx-signed-transaction-files <txSignedTransactionFiles>',
      'provide your signed transaction file',
    ),
  }),
  txTransactionDir: createOption({
    key: 'txTransactionDir' as const,
    prompt: tx.txTransactionDirPrompt,
    validation: z.string(),
    option: new Option(
      '-d, --tx-transaction-dir <txTransactionDir>',
      `Enter your transaction directory (default: "./${TRANSACTION_FOLDER_NAME}")`,
    ),
  }),
  // Dapp
  dappTemplate: createOption({
    key: 'dappTemplate',
    prompt: genericActionsPrompts.actionAskForDappTemplate,
    validation: z.string(),
    option: new Option(
      '-t, --dapp-template <dappTemplate>',
      'Select a dapp template',
    ),
  }),
  outFileJson: createOption({
    key: 'outFile',
    prompt: tx.outFilePrompt,
    validation: z.string().optional(),
    option: new Option(
      '-o, --out-file <outFile>',
      'Enter the file name to save the output',
    ),
    defaultIsOptional: true,
    transform(value: string) {
      if (!value) return null;
      const file = value.endsWith('.json') ? value : `${value}.json`;
      return join(process.cwd(), file);
    },
  }),
  selectTemplate: createOption({
    key: 'template',
    option: new Option('--template <template>', 'select a template'),
    validation: z.string(),
    prompt: tx.selectTemplate,
    async expand(templateInput: string) {
      // option 1. --template="send"
      // option 2. --template="./send.ktpl"

      let template = defaultTemplates[templateInput];

      if (template === undefined) {
        // not in template list, try to load from file
        const templatePath = join(process.cwd(), templateInput);
        const file = await services.filesystem.readFile(templatePath);

        if (file === null) {
          // not in file either, error
          throw Error(`Template "${templateInput}" not found`);
        }

        template = file;
      }

      const variables = getTemplateVariables(template);

      return { template, variables };
    },
  }),
  templateVariables: createOption({
    key: 'templateVariables',
    validation: z.object({}).passthrough(),
    option: new Option(
      '--template-variables <templateVariables>',
      'template variables',
    ),
    prompt: templateVariables,
    allowUnknownOptions: true,
  }),
} as const;

export type GlobalOptions = typeof globalOptions;
export type GlobalFlags = typeof globalFlags;
