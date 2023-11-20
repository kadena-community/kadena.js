import { input, select } from '@inquirer/prompts';
import type { ChainId } from '@kadena/types';
import { program } from 'commander';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import type { IPrompt } from '../utils/createOption.js';

import {
  // createSymbol,
  getExistingNetworks,
  isAlphabetic,
} from '../utils/helpers.js';
import { getInput } from './generic.js';

export const chainIdPrompt = async (): Promise<ChainId> =>
  (await getInput('Enter chainId (0-19)')) as ChainId;

export async function networkNamePrompt(): Promise<string> {
  return await input({
    message: 'Enter a network name (e.g. "mainnet")',
    validate: function (input) {
      if (!isAlphabetic(input)) {
        return 'Network names must be alphanumeric! Please enter a valid network name.';
      }
      return true;
    },
  });
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

export const networkSelectPrompt: IPrompt = async (prev, args, isOptional) => {
  const existingNetworks: ICustomNetworkChoice[] = getExistingNetworks();

  const choices: ICustomNetworkChoice[] = existingNetworks.map((network) => ({
    value: network.value,
    name: network.name,
  }));

  if (isOptional === true) {
    choices.push({
      value: 'skip', //skipSymbol,
      name: 'Network is optional. Continue to next step',
    });
  }

  choices.push({ value: 'createNetwork', name: 'Create a new network' }); // createSymbol

  const selectedNetwork = await select({
    message: 'Select a network',
    choices: choices,
  });

  if (selectedNetwork === 'createNetwork') {
    await program.parseAsync(['', '', 'networks', 'create']);
    return networkSelectPrompt(prev, args, isOptional);
  }

  return selectedNetwork;
};

export async function networkDeletePrompt(network: string): Promise<string> {
  return await select({
    message: `Are you sure you want to delete the configuration for network "${network}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
}
