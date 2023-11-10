import { input, select } from '@inquirer/prompts';
import { program } from 'commander';
import path from 'path';
import { ICustomNetworksChoice } from '../networks/networksHelpers.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { getExistingNetworks, getVersion } from '../utils/helpers.js';
import { defaultNetworksPath } from './networks.js';
import { ChainId } from '@kadena/types';

export const accountPrompt = async () =>
  await input({ message: 'Enter the Kadena k:account' });

export const chainIdPrompt = async (): Promise<ChainId> =>
  await input({ message: 'Enter chainId (0-19)' }) as ChainId;

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

  // At this point there is either no network defined yet.
  // Create and select new network.
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
