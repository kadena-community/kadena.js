import { checkbox, input, select } from '@inquirer/prompts';
import type { ChainId } from '@kadena/types';
import { program } from 'commander';
import path from 'path';
import type { ICustomAccountsChoice } from '../account/accountHelpers.js';
import type { ICustomKeypairsChoice } from '../keypair/keypairHelpers.js';
import type { ICustomKeysetsChoice } from '../keyset/keysetHelpers.js';
import type { ICustomNetworksChoice } from '../networks/networksHelpers.js';
import { ensureFileExists } from '../utils/filesystem.js';
import {
  getExistingAccounts,
  getExistingKeypairs,
  getExistingKeysets,
  getExistingNetworks,
} from '../utils/helpers.js';
import { defaultKeypairsPath } from './keypairs.js';
import { defaultKeysetsPath } from './keysets.js';
import { defaultNetworksPath } from './networks.js';

export const keypairPrompt = async (): Promise<string> => {
  const existingKeypairs: ICustomKeypairsChoice[] = getExistingKeypairs();

  if (existingKeypairs.length > 0) {
    const selectedKeypair = await select({
      message: 'Select a keypair',
      choices: [
        ...existingKeypairs,
        { value: undefined, name: 'Create a new keypair' },
      ],
    });

    if (selectedKeypair !== undefined) {
      return selectedKeypair;
    }
  }

  // At this point there is either no keypair defined yet,
  // or the user chose to create a new keypair.
  // Create and select new keypair.
  await program.parseAsync(['', '', 'keypair', 'create']);

  return await keypairPrompt();
};

export const gasPayerPrompt = async (): Promise<string> => {
  const existingAccounts: ICustomAccountsChoice[] = await getExistingAccounts();

  if (existingAccounts.length > 0) {
    const selectedKeypair = await select({
      message: 'Select a gas payer account',
      choices: [
        ...existingAccounts,
        { value: undefined, name: 'Create a new account' },
      ],
    });

    if (selectedKeypair !== undefined) {
      return selectedKeypair;
    }
  }

  // At this point there is either no account defined yet,
  // or the user chose to create a new account.
  // Create and select new account.
  await program.parseAsync(['', '', 'account', 'create']);

  return await keypairPrompt();
};

export const accountPrompt = async (): Promise<string> => {
  const existingAccounts: ICustomAccountsChoice[] = await getExistingAccounts();

  if (existingAccounts.length > 0) {
    const selectedKeypair = await select({
      message: 'Select an account',
      choices: [
        ...existingAccounts,
        { value: undefined, name: 'Create a new account' },
      ],
    });

    if (selectedKeypair !== undefined) {
      return selectedKeypair;
    }
  }

  // At this point there is either no account defined yet,
  // or the user chose to create a new account.
  // Create and select new account.
  await program.parseAsync(['', '', 'account', 'create']);

  return await keypairPrompt();
};

export const accountNamePrompt = async (): Promise<string> =>
  await input({ message: 'Enter the name of the account configuration' });

export const chainIdPrompt = async (): Promise<ChainId> =>
  (await input({ message: 'Enter chainId (0-19)' })) as ChainId;

export const keypairDeletePrompt = async (name: string): Promise<string> =>
  await select({
    message: `Are you sure you want to delete the keypair "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

export const keypairOverwritePrompt = async (
  name?: string,
): Promise<string> => {
  const message =
    name === 'string' && name.length > 0
      ? `Are you sure you want to save this keypair "${name}"?`
      : 'A keypair with this name already exists. Do you want to update it?';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const keypairNamePrompt = async (): Promise<string> => {
  const name = await input({
    message: 'Enter a keypair name',
  });

  const filePath = path.join(defaultKeypairsPath, `${name}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await keypairOverwritePrompt();
    if (overwrite === 'no') {
      return await keypairNamePrompt();
    }
  }

  return name;
};

export const keysetDeletePrompt = async (name: string): Promise<string> =>
  await select({
    message: `Are you sure you want to delete the keyset "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

export const keysetOverwritePrompt = async (name?: string): Promise<string> => {
  const message =
    typeof name === 'string' && name.length > 0
      ? `Are you sure you want to save the keyset "${name}"?`
      : 'A keyset with this name already exists. Do you want to update it?';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const keysetNamePrompt = async (): Promise<string> => {
  const name = await input({
    message: 'Enter a keyset name',
  });

  const filePath = path.join(defaultKeysetsPath, `${name}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await keysetOverwritePrompt();
    if (overwrite === 'no') {
      return await keysetNamePrompt();
    }
  }

  return name;
};

export const keysetPredicatePrompt = async (): Promise<string> =>
  await select({
    message: 'Select a keyset predicate',
    choices: [
      { value: 'keys-all', name: 'keys-all' },
      { value: 'keys-one', name: 'keys-one' },
      { value: 'keys-two', name: 'keys-two' },
    ],
  });

export const keysetPrompt = async (): Promise<string> => {
  const existingKeysets: ICustomKeysetsChoice[] = getExistingKeysets();

  if (existingKeysets.length > 0) {
    const selectedKeyset = await select({
      message: 'Select a keyset',
      choices: [
        ...existingKeysets,
        { value: undefined, name: 'Create a new keyset' },
      ],
    });

    if (selectedKeyset !== undefined) {
      return selectedKeyset;
    }
  }

  // At this point there is either no keyset defined yet,
  // or the user chose to create a new keyset.
  // Create and select new keyset.
  await program.parseAsync(['', '', 'keyset', 'create']);

  return await keysetPrompt();
};

export const networkPrompt = async (): Promise<string> => {
  const existingNetworks: ICustomNetworksChoice[] = getExistingNetworks();

  if (existingNetworks.length > 0) {
    const selectedNetwork = await select({
      message: 'Select a network',
      choices: [
        ...existingNetworks,
        { value: undefined, name: 'Define a new network' },
      ],
    });

    if (selectedNetwork !== undefined) {
      return selectedNetwork;
    }
  }

  // At this point there is either no network defined yet,
  // or the user chose to define a new network.
  // Create and select new network.
  await program.parseAsync(['', '', 'networks', 'create']);

  return await networkPrompt();
};

export const networkSelectPrompt = async (): Promise<string> => {
  const existingNetworks: ICustomNetworksChoice[] = getExistingNetworks();

  if (existingNetworks.length > 0) {
    return await select({
      message: 'Select a network',
      choices: existingNetworks,
    });
  }

  // At this point there is no network defined yet.
  // Create and select a new network.
  await program.parseAsync(['', '', 'networks', 'create']);

  return await networkSelectPrompt();
};

export const keypairSelectPrompt = async (): Promise<string> => {
  const existingKeypairs: ICustomKeypairsChoice[] = getExistingKeypairs();

  if (existingKeypairs.length > 0) {
    return await select({
      message: 'Select a keypair',
      choices: existingKeypairs,
    });
  }

  // At this point there is no keypair defined yet.
  // Create and select a new keypair.
  await program.parseAsync(['', '', 'keypair', 'create']);

  return await networkSelectPrompt();
};

export const keysetSelectPrompt = async (): Promise<string> => {
  const existingKeysets: ICustomKeysetsChoice[] = getExistingKeysets();

  if (existingKeysets.length > 0) {
    return await select({
      message: 'Select a keyset',
      choices: existingKeysets,
    });
  }

  // At this point there is no keyset defined yet.
  // Create and select a new keyset.
  await program.parseAsync(['', '', 'keyset', 'create']);

  return await networkSelectPrompt();
};

export const networkOverwritePrompt = async (
  network?: string,
): Promise<string> => {
  const message =
    typeof network === 'string' && network.length > 0
      ? `Are you sure you want to save this configuration for network "${network}"?`
      : 'A network configuration with this name already exists. Do you want to update it?';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const networkNamePrompt = async (): Promise<string> => {
  const networkName = await input({
    message: 'Enter a network name (e.g. "mainnet")',
  });

  const filePath = path.join(defaultNetworksPath, `${networkName}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await networkOverwritePrompt();
    if (overwrite === 'no') {
      return await networkNamePrompt();
    }
  }

  return networkName;
};

export const networkDeletePrompt = async (network: string): Promise<string> =>
  await select({
    message: `Are you sure you want to delete the configuration for network "${network}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

export const networkIdPrompt = async (): Promise<string> =>
  await input({ message: `Enter a network id (e.g. "mainnet01")` });

export const networkHostPrompt = async (): Promise<string> =>
  await input({
    message: 'Enter Kadena network host (e.g. "https://api.chainweb.com")',
  });

export const networkExplorerUrlPrompt = async (): Promise<string> =>
  await input({
    message:
      'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
  });

export const publicKeysPrompt = async (): Promise<string> =>
  await input({
    message: 'Enter zero or more public keys (comma separated).',
  });

export const selectKeypairsPrompt = async (): Promise<string[]> => {
  const existingKeypairs: ICustomKeypairsChoice[] = getExistingKeypairs();

  if (existingKeypairs.length === 0) {
    return [];
  }

  return await checkbox({
    message: 'Select zero or more keypairs',
    choices: existingKeypairs,
  });
};
