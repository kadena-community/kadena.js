import { select } from '@inquirer/prompts';
import type { ChainId } from '@kadena/types';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import { getExistingNetworks } from '../utils/helpers.js';
import { getInput } from './generic.js';

export const chainIdPrompt = async (): Promise<ChainId> =>
  (await getInput('Enter chainId (0-19)')) as ChainId;

export async function networkNamePrompt(): Promise<string> {
  return await getInput('Enter a network name (e.g. "mainnet")');
}

export async function networkIdPrompt(): Promise<string> {
  return await getInput('Enter a network id (e.g. "mainnet01")');
}

export async function networkHostPrompt(): Promise<string> {
  return await getInput(
    'Enter Kadena network host (e.g. "https://api.chainweb.com")',
  );
}

export async function networkExplorerUrlPrompt(): Promise<string> {
  return await getInput(
    'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
  );
}

export async function networkOverwritePrompt(
  network?: string,
): Promise<string> {
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
}

export async function networkSelectPrompt(): Promise<string> {
  const existingNetworks: ICustomNetworkChoice[] = getExistingNetworks();

  if (existingNetworks.length > 0) {
    return await select({
      message: 'Select a network',
      choices: existingNetworks,
    });
  }

  return '';
}

export async function networkDeletePrompt(network: string): Promise<string> {
  return await select({
    message: `Are you sure you want to delete the configuration for network "${network}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
}
