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
import { parseKeyPairsInput } from '../keys/utils/keysHelpers.js';
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
  walletSelect: createOption({
    key: 'walletName',
    prompt: wallets.walletSelectPrompt,
    validation: z.string(),
    option: new Option('-w, --wallet-name <walletName>', 'Enter your wallet'),
    defaultIsOptional: false,
    expand: async (walletAlias: string) => {
      return await services.wallet.getByAlias(walletAlias);
    },
  }),
  walletsSelectByWallet: createOption({
    key: 'walletName',
    prompt: async (args) => {
      return Array.isArray(args.wallets)
        ? wallets.walletSelectByWalletPrompt(args.wallets)
        : wallets.walletSelectPrompt();
    },
    validation: z.string(),
    option: new Option('-w, --wallet-name <walletName>', 'Enter your wallet'),
    defaultIsOptional: false,
    expand: async (walletAlias: string) => {
      return await services.wallet.getByAlias(walletAlias);
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
  directory: createOption({
    key: 'directory' as const,
    // Directory is an optional flag, and never prompted
    prompt: () => null,
    validation: z.string().optional(),
    option: new Option(
      '--directory <directory>',
      `Enter your directory (default: working directory)`,
    ),
    transform(value: string) {
      if (typeof value !== 'string' || value === '') {
        return process.cwd();
      }
      return value;
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
