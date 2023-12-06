import { Option, program } from 'commander';
import { z } from 'zod';
import {
  // account,
  // contract,
  devnet as devnetPrompts,
  generic,
  genericActionsPrompts,
  keys,
  // marmalade,
  networks,
  security,
} from '../prompts/index.js';

import chalk from 'chalk';
import { HDKEY_ENC_EXT, HDKEY_ENC_LEGACY_EXT } from '../constants/config.js';
import { loadDevnetConfig } from '../devnet/utils/devnetHelpers.js';
import { readKeyFileContent } from '../keys/utils/storage.js';
import {
  ensureNetworksConfiguration,
  loadNetworkConfig,
} from '../networks/utils/networkHelpers.js';
import { createExternalPrompt } from '../prompts/generic.js';
import { networkNamePrompt } from '../prompts/network.js';
import { createOption } from './createOption.js';
import { ensureDevnetsConfiguration } from './helpers.js';

// eslint-disable-next-line @rushstack/typedef-var
export const globalFlags = {
  ci: new Option('--ci', 'CI mode (disables interactive prompts)'),
  legacy: new Option('-l, --legacy', 'Output legacy format'),
} as const;

// eslint-disable-next-line @rushstack/typedef-var
export const globalOptions = {
  // global
  ci: createOption({
    key: 'ci' as const,
    prompt: ({ ci }: { ci: boolean }) => {
      const result = ci || false;
      return Promise.resolve(result);
    },
    validation: z.boolean().optional(),
    option: globalFlags.ci,
  }),
  legacy: createOption({
    key: 'legacy' as const,
    prompt: ({ legacy }: { legacy: boolean }) => {
      const result = legacy || false;
      return Promise.resolve(result);
    },
    validation: z.boolean().optional(),
    option: globalFlags.legacy,
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
      'Enter the number of key pairs you want to generate (default: 1)',
    ),
  }),
  keyGenFromHdChoice: createOption({
    key: 'keyGenFromHdChoice',
    prompt: keys.genFromHdChoicePrompt,
    validation: z.string(),
    option: new Option(
      '-c, --key-gen-from-hd-choice <keyGenFromHdChoice>',
      'Choose an action for generating keys',
    ),
  }),
  keySeed: createOption({
    key: 'keySeed',
    prompt: keys.keySeed,
    validation: z.string(),
    option: new Option(
      '-s, --key-seed <choice>',
      'Enter your seed to generate keys from',
    ),
    transform: (keySeed: string) => {
      if (
        keySeed.includes(HDKEY_ENC_EXT) ||
        keySeed.includes(HDKEY_ENC_LEGACY_EXT)
      ) {
        return readKeyFileContent(keySeed);
      }
      return keySeed;
    },
  }),
  keyPassword: createOption({
    key: 'keyPassword' as const,
    prompt: security.securityPassword,
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
  key: createOption({
    key: 'key' as const,
    prompt: keys.keySelectPrompt,
    validation: z.string(),
    option: new Option('-k, --key <key>', 'Select key from keyfile'),
  }),
} as const;

export type GlobalOptions = typeof globalOptions;
export type GlobalFlags = typeof globalFlags;
