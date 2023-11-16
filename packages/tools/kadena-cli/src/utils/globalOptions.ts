import { Option } from 'commander';
import { z } from 'zod';
import {
  accountNamePrompt,
  accountPrompt,
  chainIdPrompt,
  devnetPrompt,
  devnetMountPactFolderPrompt,
  devnetNamePrompt,
  devnetPortPrompt,
  devnetSelectPrompt,
  devnetUseVolumePrompt,
  devnetVersionPrompt,
  gasPayerPrompt,
  keypairNamePrompt,
  keypairPrompt,
  keypairSelectPrompt,
  keysetNamePrompt,
  keysetPredicatePrompt,
  keysetPrompt,
  keysetSelectPrompt,
  networkExplorerUrlPrompt,
  networkHostPrompt,
  networkIdPrompt,
  networkNamePrompt,
  networkPrompt,
  networkSelectPrompt,
  publicKeysPrompt,
  selectKeypairsPrompt,
} from '../constants/prompts.js';
import { loadNetworkConfig } from '../networks/networksHelpers.js';
import { ensureAccountsConfiguration, ensureDevnetsConfiguration, ensureKeypairsConfiguration, ensureKeysetsConfiguration, ensureNetworksConfiguration } from './helpers.js';
import { program } from 'commander';
import chalk from 'chalk';
import { loadKeypairConfig } from '../keypair/keypairHelpers.js';
import { loadKeysetConfig } from '../keyset/keysetHelpers.js';
import { loadAccountConfig } from '../account/accountHelpers.js';
import { loadDevnetConfig } from '../devnet/devnetHelpers.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createOption = <
  T extends {
    prompt: any;
    validation: any;
    option: Option;
    expand?: (label: string) => any;
  },
>(
  option: T,
) => {
  return (optional: boolean = true) => ({
    ...option,
    validation: optional ? option.validation.optional() : option.validation,
  });
};

export const globalOptions = {
  account: createOption({
    key: 'account' as const,
    prompt: accountPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --account <account>',
      'Keypair name',
    ),
    expand: async (account: string) => {
      await ensureAccountsConfiguration();
      try {
        return loadAccountConfig(account);
      } catch (e) {
        console.log(chalk.yellow(`\nNo account "${account}" found. Please create the account.\n`));
        await program.parseAsync(['', '', 'account', 'create']);
        const accountName = await accountPrompt();
        return loadAccountConfig(accountName);
      }
    },
  }),
  accountName: createOption({
    key: 'account' as const,
    prompt: accountNamePrompt,
    validation: z.string(),
    option: new Option(
      '-a, --account <account>',
      'Receiver (k:) wallet address',
    ),
  }),
  chainId: createOption({
    key: 'chainId' as const,
    prompt: chainIdPrompt,
    validation: z
      .string({
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        invalid_type_error: 'Error: -c, --chain-id must be a number',
      })
      .min(0)
      .max(19),
    option: new Option('-c, --chain-id <chainId>'),
  }),
  devnet: createOption({
    key: 'devnet' as const,
    prompt: devnetPrompt,
    validation: z.string(),
    option: new Option(
      '-d, --devnet <devnet>',
      'Devnet name',
    ),
    expand: async (devnet: string) => {
      await ensureDevnetsConfiguration();
      try {
        return loadDevnetConfig(devnet);
      } catch (e) {
        console.log(chalk.yellow(`\nNo devnet "${devnet}" found. Please create the devnet.\n`));
        await program.parseAsync(['', '', 'devnet', 'create']);
        const devnetName = await devnetPrompt();
        return loadDevnetConfig(devnetName);
      }
    },
  }),
  devnetName: createOption({
    key: 'name' as const,
    prompt: devnetNamePrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Devnet name (e.g. "devnet")'),
  }),
  devnetPort: createOption({
    key: 'port' as const,
    prompt: devnetPortPrompt,
    validation: z.number(),
    option: new Option(
      '-p, --port <port>',
      'Port to forward to the Chainweb node API (e.g. 8080)',
    ).argParser((value) => parseInt(value, 10)),
  }),
  devnetUseVolume: createOption({
    key: 'useVolume' as const,
    prompt: devnetUseVolumePrompt,
    validation: z.boolean(),
    option: new Option(
      '-u, --useVolume',
      'Create a persistent volume to mount to the container'
    ),
  }),
  devnetMountPactFolder: createOption({
    key: 'mountPactFolder' as const,
    prompt: devnetMountPactFolderPrompt,
    validation: z.string(),
    option: new Option(
      '-m, --mountPactFolder <mountPactFolder>',
      'Mount a folder containing Pact files to the container (e.g. "./pact")',
    ),
  }),
  devnetSelect: createOption({
    key: 'name' as const,
    prompt: devnetSelectPrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Devnet name'),
  }),
  devnetVersion: createOption({
    key: 'version' as const,
    prompt: devnetVersionPrompt,
    validation: z.string(),
    option: new Option(
      '-v, --version <version>',
      'Version of the kadena/devnet Docker image to use (e.g. "latest")',
    ),
  }),
  keypair: createOption({
    key: 'keypair' as const,
    prompt: keypairPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --keypair <keypair>',
      'Keypair name',
    ),
    expand: async (keypair: string) => {
      await ensureKeypairsConfiguration();
      try {
        return loadKeypairConfig(keypair);
      } catch (e) {
        console.log(chalk.yellow(`\nNo keypair "${keypair}" found. Please create the keypair.\n`));
        await program.parseAsync(['', '', 'keypair', 'create']);
        const keypairName = await keypairPrompt();
        return loadKeypairConfig(keypairName);
      }
    },
  }),
  gasPayer: createOption({
    key: 'gasPayer' as const,
    prompt: gasPayerPrompt,
    validation: z.string(),
    option: new Option(
      '-g, --gas-payer <gasPayer>',
      'Gas payer account',
    ),
    expand: async (gasPayer: string) => {
      await ensureAccountsConfiguration();
      try {
        return loadAccountConfig(gasPayer);
      } catch (e) {
        console.log(chalk.yellow(`\nNo account "${gasPayer}" found. Please create the account.\n`));
        await program.parseAsync(['', '', 'account', 'create']);
        const accountName = await accountPrompt();
        return loadAccountConfig(accountName);
      }
    },
  }),
  keypairName: createOption({
    key: 'name' as const,
    prompt: keypairNamePrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Keypair name'),
  }),
  keypairSelect: createOption({
    key: 'name' as const,
    prompt: keypairSelectPrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Keypair name'),
  }),
  keyset: createOption({
    key: 'keyset' as const,
    prompt: keysetPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --keyset <keyset>',
      'Keyset name',
    ),
    expand: async (keyset: string) => {
      await ensureKeysetsConfiguration();
      try {
        return loadKeysetConfig(keyset);
      } catch (e) {
        console.log(chalk.yellow(`\nNo keyset "${keyset}" found. Please create the keyset.\n`));
        await program.parseAsync(['', '', 'keyset', 'create']);
        const keysetName = await keysetPrompt();
        return loadKeysetConfig(keysetName);
      }
    },
  }),
  keysetName: createOption({
    key: 'name' as const,
    prompt: keysetNamePrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Keyset name'),
  }),
  keysetPredicate: createOption({
    key: 'predicate' as const,
    prompt: keysetPredicatePrompt,
    validation: z.string(),
    option: new Option('-p, --predicate <predicate>', 'Keyset predicate'),
  }),
  keysetSelect: createOption({
    key: 'name' as const,
    prompt: keysetSelectPrompt,
    validation: z.string(),
    option: new Option('-n, --name <name>', 'Keyset name'),
  }),
  network: createOption({
    key: 'network' as const,
    prompt: networkPrompt,
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
        console.log(chalk.yellow(`\nNo configuration for network "${network}" found. Please configure the network.\n`));
        await program.parseAsync(['', '', 'networks', 'create']);
        const networkName = await networkPrompt();
        return loadNetworkConfig(networkName);
      }
    },
  }),
  networkSelect: createOption({
    key: 'network' as const,
    prompt: networkSelectPrompt,
    validation: z.string(),
    option: new Option('-n, --network <network>', 'Kadena network (e.g. "mainnet")'),
  }),
  networkName: createOption({
    key: 'network' as const,
    prompt: networkNamePrompt,
    validation: z.string(),
    option: new Option('-n, --network <network>', 'Kadena network (e.g. "mainnet")'),
  }),
  networkId: createOption({
    key: 'networkId' as const,
    prompt: networkIdPrompt,
    validation: z.string(),
    option: new Option('-nid, --network-id <networkId>', 'Kadena network Id (e.g. "mainnet01")'),
  }),
  networkHost: createOption({
    key: 'networkHost' as const,
    prompt: networkHostPrompt,
    validation: z.string(),
    option: new Option('-h, --network-host <networkHost>', 'Kadena network host (e.g. "https://api.chainweb.com")'),
  }),
  networkExplorerUrl: createOption({
    key: 'networkExplorerUrl' as const,
    prompt: networkExplorerUrlPrompt,
    validation: z.string().optional(),
    option: new Option('-e, --network-explorer-url <networkExplorerUrl>', 'Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")'),
  }),
  otherPublicKeys: createOption({
    key: 'publicKeys' as const,
    prompt: publicKeysPrompt,
    validation: z.string().optional(),
    option: new Option('-p, --public-keys <publicKeys>', 'Public keys (comma separated)'),
    expand: async (publicKeys: string) => {
      return publicKeys.split(',').map(value => value.trim());
    },
  }),
  publicKeysFromKeypairs: createOption({
    key: 'publicKeysFromKeypairs' as const,
    prompt: selectKeypairsPrompt,
    validation: z.array(z.string()),
    option: new Option('-k, --public-keys-from-keypairs <publicKeysFromKeypairs...>', 'Public keys from keypairs'),
    expand: async (publicKeysFromKeypairs) => {
      let publicKeys: string[] = []
      for (let keypair of publicKeysFromKeypairs) {
        const keypairConfig = await loadKeypairConfig(keypair)
        publicKeys.push(keypairConfig.publicKey || '');
      }
      return publicKeys
    },
  }),
} as const;
