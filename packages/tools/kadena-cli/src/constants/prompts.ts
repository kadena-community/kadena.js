import { checkbox, input, select } from '@inquirer/prompts';
import { program } from 'commander';
import path from 'path';
import { ICustomNetworksChoice } from '../networks/networksHelpers.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { getExistingAccounts, getExistingDevnets, getExistingKeypairs, getExistingKeysets, getExistingNetworks } from '../utils/helpers.js';
import { defaultNetworksPath } from './networks.js';
import { ChainId } from '@kadena/types';
import { defaultKeypairsPath } from './keypairs.js';
import { ICustomKeypairsChoice } from '../keypair/keypairHelpers.js';
import { defaultKeysetsPath } from './keysets.js';
import { ICustomKeysetsChoice } from '../keyset/keysetHelpers.js';
import { ICustomAccountsChoice } from '../account/accountHelpers.js';
import { defaultDevnetsPath } from './devnets.js';
import { ICustomDevnetsChoice } from '../devnet/devnetHelpers.js';

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

export const accountNamePrompt = async () =>
  await input({ message: 'Enter the name of the account configuration' });

export const chainIdPrompt = async (): Promise<ChainId> =>
  await input({ message: 'Enter chainId (0-19)' }) as ChainId;

export const keypairDeletePrompt = async (name: string) =>
  await select({
    message: `Are you sure you want to delete the keypair "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

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

export const keypairOverwritePrompt = async (name?: string) => {
  const message = name
    ? `Are you sure you want to save this keypair "${name}"?`
    : 'A keypair with this name already exists. Do you want to update it?'

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const keypairPrompt = async (): Promise<string> => {
  const existingKeypairs: ICustomKeypairsChoice[] = await getExistingKeypairs();

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

export const keypairSelectPrompt = async (): Promise<string> => {
  const existingKeypairs: ICustomKeypairsChoice[] = await getExistingKeypairs();

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

export const keysetDeletePrompt = async (name: string) =>
  await select({
    message: `Are you sure you want to delete the keyset "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

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

export const keysetOverwritePrompt = async (name?: string) => {
  const message = name
    ? `Are you sure you want to save the keyset "${name}"?`
    : 'A keyset with this name already exists. Do you want to update it?'

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
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
  const existingKeysets: ICustomKeysetsChoice[] = await getExistingKeysets();

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

export const keysetSelectPrompt = async (): Promise<string> => {
  const existingKeysets: ICustomKeysetsChoice[] = await getExistingKeysets();

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

export const networkPrompt = async (): Promise<string> => {
  const existingNetworks: ICustomNetworksChoice[] = await getExistingNetworks();

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
  const existingNetworks: ICustomNetworksChoice[] = await getExistingNetworks();

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

export const networkOverwritePrompt = async (network?: string) => {
  const message = network
    ? `Are you sure you want to save this configuration for network "${network}"?`
    : 'A network configuration with this name already exists. Do you want to update it?'

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
}

export const networkDeletePrompt = async (network: string) =>
  await select({
    message: `Are you sure you want to delete the configuration for network "${network}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

export const networkIdPrompt = async () =>
  await input({ message: `Enter a network id (e.g. "mainnet01")` });

export const networkHostPrompt = async () =>
  await input({
    message: 'Enter Kadena network host (e.g. "https://api.chainweb.com")',
  });

export const networkExplorerUrlPrompt = async () =>
  await input({
    message:
      'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
  });

export const publicKeysPrompt = async () =>
  await input({
    message:
      'Enter zero or more public keys (comma separated).',
  });

export const selectKeypairsPrompt = async () => {
  const existingKeypairs: ICustomKeypairsChoice[] = await getExistingKeypairs();

  if (existingKeypairs.length === 0) {
    return [];
  }

  return await checkbox({
    message: 'Select zero or more keypairs',
    choices: existingKeypairs,
  })
}

export const devnetNamePrompt = async (): Promise<string> => {
  const containerName = await input({
    message: 'Enter a devnet name (e.g. "devnet")',
  });

  const filePath = path.join(defaultDevnetsPath, `${containerName}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await devnetOverwritePrompt();
    if (overwrite === 'no') {
      return await devnetNamePrompt();
    }
  }

  return containerName;
};

export const devnetOverwritePrompt = async (name?: string) => {
  const message = name
    ? `Are you sure you want to save this configuration for devnet "${name}"?`
    : 'A devnet configuration with this name already exists. Do you want to update it?'

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const devnetPortPrompt = async (): Promise<number> => {
  const port = await input({
    default: '8080',
    message: 'Enter a port number to forward to the Chainweb node API',
    validate: function (input) {
      const port = parseInt(input);
      if (isNaN(port)) {
        return 'Port must be a number! Please enter a valid port number.';
      }
      return true;
    },
  });
  return parseInt(port);
};

export const devnetUseVolumePrompt = async (): Promise<boolean> =>
  await select({
    message: 'Would you like to create a persistent volume?',
    choices: [
      { value: false, name: 'No' },
      { value: true, name: 'Yes' },
    ],
  });

export const devnetMountPactFolderPrompt = async (): Promise<string> =>
  await input({
    default: '',
    message:
      'Enter the relative path to a folder containing your Pact files to mount (e.g. ./pact) or leave empty to skip.',
  });

  export const devnetVersionPrompt = async (): Promise<string> =>
  await input({
    default: 'latest',
    message:
    'Enter the version of the kadena/devnet image you would like to use.',
  });

export const devnetSelectPrompt = async (): Promise<string> => {
  const existingDevnets: ICustomDevnetsChoice[] = await getExistingDevnets();

  if (existingDevnets.length > 0) {
    return await select({
      message: 'Select a devnet',
      choices: existingDevnets,
    });
  }

  // At this point there is no devnet defined yet.
  // Create and select a new devnet.
  await program.parseAsync(['', '', 'devnet', 'create']);

  return await networkSelectPrompt();
};

export const devnetDeletePrompt = async (name: string) =>
  await select({
    message: `Are you sure you want to delete the devnet "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

export const devnetPrompt = async (): Promise<string> => {
  const existingDevnets: ICustomDevnetsChoice[] = await getExistingDevnets();

  if (existingDevnets.length > 0) {
    const selectedDevnet = await select({
      message: 'Select a devnet',
      choices: [
        ...existingDevnets,
        { value: undefined, name: 'Create a new devnet' },
      ],
    });

    if (selectedDevnet !== undefined) {
      return selectedDevnet;
    }
  }

  // At this point there is either no devnet defined yet,
  // or the user chose to create a new devnet.
  // Create and select new devnet.
  await program.parseAsync(['', '', 'devnet', 'create']);

  return await devnetPrompt();
};
