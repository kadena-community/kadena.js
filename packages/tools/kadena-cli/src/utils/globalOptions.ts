import { Option, program } from 'commander';
import { z } from 'zod';
import {
  generic,
  keys,
  networks,
  security,
  tx,
  wallets,
} from '../prompts/index.js';

import type { ChainId } from '@kadena/types';
import { join } from 'node:path';

import {
  chainIdValidation,
  formatZodFieldErrors,
} from '../account/utils/accountHelpers.js';
import { KEY_EXT, WALLET_EXT } from '../constants/config.js';
import {
  parseKeyIndexOrRange,
  parseKeyPairsInput,
} from '../keys/utils/keysHelpers.js';
import { readKeyFileContent } from '../keys/utils/storage.js';
import { loadNetworkConfig } from '../networks/utils/networkHelpers.js';
import { services } from '../services/index.js';
import { createOption } from './createOption.js';
import { getDefaultNetworkName, passwordPromptTransform } from './helpers.js';
import { log } from './logger.js';

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
  // Logs
  logFolder: createOption({
    key: 'logFolder' as const,
    prompt: generic.logFolderPrompt,
    validation: z.string(),
    option: new Option(
      '-l, --log-folder <logFolder>',
      'Directory where the log file will be generated. (e.g. ./kadena/simulation-logs/',
    ),
  }),
  // Network
  network: createOption({
    key: 'network' as const,
    prompt: networks.networkSelectPrompt,
    defaultValue: await getDefaultNetworkName(),
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand: async (network: string) => {
      try {
        return await loadNetworkConfig(network);
      } catch (e) {
        log.info(
          `\nNo configuration for network "${network}" found. Please configure the network.\n`,
        );
        await program.parseAsync(['', '', 'networks', 'create']);
        return await loadNetworkConfig(network);
      }
    },
  }),
  networkSelect: createOption({
    key: 'network' as const,
    prompt: networks.networkSelectOnlyPrompt,
    defaultIsOptional: false,
    defaultValue: await getDefaultNetworkName(),
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand: async (network: string) => {
      try {
        return await loadNetworkConfig(network);
      } catch (e) {
        throw new Error(
          `No network configuration found for "${network}". Please create a "${network}" network.`,
        );
      }
    },
  }),
  chainId: createOption({
    key: 'chainId' as const,
    prompt: networks.chainIdPrompt,
    defaultIsOptional: false,
    validation: z.string({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain-id must be a number',
    }),
    option: new Option('-c, --chain-id <chainId>'),
    transform: (chainId: string) => {
      const parsedChainId = Number(chainId.trim());
      try {
        chainIdValidation.parse(parsedChainId);
        return parsedChainId.toString() as ChainId;
      } catch (error) {
        const errorMessage = formatZodFieldErrors(error);
        throw new Error(`Error: -c --chain-id ${errorMessage}`);
      }
    },
  }),
  // Keys
  keyPairs: createOption({
    key: 'keyPairs',
    prompt: keys.keyPairsPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --key-pairs <keyPairs>',
      'Enter key pairs as string publicKey=xxx,secretKey=xxx;...',
    ),
    transform: (input) => {
      try {
        return parseKeyPairsInput(input);
      } catch (error) {
        throw new Error(`Error parsing key pairs: ${error.message}`);
      }
    },
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
  keyGenFromChoice: createOption({
    key: 'keyGenFromChoice',
    prompt: keys.genFromChoicePrompt,
    validation: z.string(),
    option: new Option(
      '-c, --key-gen-from-choice <keyGenFromChoice>',
      'Choose an action for generating keys',
    ),
  }),
  walletSelect: createOption({
    key: 'walletName',
    prompt: wallets.walletSelectPrompt,
    validation: z.string(),
    option: new Option('-w, --wallet-name <walletName>', 'Enter your wallet'),
    defaultIsOptional: false,
    expand: async (filepath: string) => {
      return await services.wallet.get(filepath);
    },
  }),
  walletsSelectByWallet: createOption({
    key: 'walletName',
    prompt: async (args) => {
      return Array.isArray(args.wallets)
        ? wallets.walletSelectByWalletPrompt(args.wallets as string[])
        : wallets.walletSelectPrompt();
    },
    validation: z.string(),
    option: new Option('-w, --wallet-name <walletName>', 'Enter your wallet'),
    defaultIsOptional: false,
  }),
  message: createOption({
    key: 'message' as const,
    prompt: generic.messagePrompt,
    validation: z.string(),
    option: new Option('-m, --message <message>', 'Enter message to decrypt'),
    transform: async (message: string) => {
      if (message.includes(WALLET_EXT) || message.includes(KEY_EXT)) {
        const keyFileContent = await readKeyFileContent(message);
        if (typeof keyFileContent === 'string') {
          return keyFileContent;
        }
        return keyFileContent?.secretKey;
      }
      return message;
    },
  }),
  // common
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
} as const;

export const securityOptions = {
  createPasswordOption: (
    args: Parameters<typeof security.passwordPrompt>[0],
    optionArgs?: Parameters<ReturnType<typeof createOption>>[0],
  ) => {
    return createOption({
      key: 'passwordFile' as const,
      prompt: security.passwordPrompt(args),
      validation: z.string().or(z.object({ _password: z.string() })),
      option: new Option(
        '--password-file <passwordFile>',
        'Filepath to the password file',
      ),
      transform: passwordPromptTransform('--password-file'),
    })(optionArgs);
  },
  createNewPasswordOption: (
    args: Parameters<typeof security.passwordPrompt>[0],
    optionArgs?: Parameters<ReturnType<typeof createOption>>[0],
  ) => {
    return createOption({
      key: 'newPasswordFile' as const,
      prompt: security.passwordPrompt(args),
      validation: z.string().or(z.object({ _password: z.string() })),
      option: new Option(
        '--new-password-file <newPasswordFile>',
        'Filepath to the new password file',
      ),
      transform: passwordPromptTransform('--new-password-file'),
    })(optionArgs);
  },
};

export type GlobalOptions = typeof globalOptions;
export type GlobalFlags = typeof globalFlags;
