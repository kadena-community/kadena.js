import { input, select } from '@inquirer/prompts';
import type { ChainId } from '@kadena/types';
import { program } from 'commander';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import type { IPrompt } from '../utils/createOption.js';
import { getExistingNetworks, isAlphabetic } from '../utils/helpers.js';
import { getInput } from './generic.js'; // Importing getInput from another file

export const chainIdPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue;
  return (await getInput('Enter ChainId (0-19)', defaultValue)) as ChainId;
};

export const networkNamePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue;

  return await input({
    message: 'Enter a network name (e.g. "mainnet")',
    default: defaultValue,
    validate: function (input) {
      if (!isAlphabetic(input)) {
        return 'Network names must be alphanumeric! Please enter a valid network name.';
      }
      return true;
    },
  });
};

export const networkIdPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue;
  return await getInput('Enter a network id (e.g. "mainnet01")', defaultValue);
};

export const networkHostPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue;
  return await getInput(
    'Enter Kadena network host (e.g. "https://api.chainweb.com")',
    defaultValue,
  );
};

export const networkExplorerUrlPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue;
  return await getInput(
    'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    defaultValue,
  );
};

export const networkOverwritePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  // Determine which value to use for the message
  const networkName =
    args.defaultValue ?? previousQuestions.network ?? args.network;

  if (networkName === undefined) {
    throw new Error('Network name is required for the overwrite prompt.');
  }

  const message = `Are you sure you want to save this configuration for network "${networkName}"?`;

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const networkSelectPrompt: IPrompt = async (prev, args, isOptional) => {
  const existingNetworks: ICustomNetworkChoice[] = getExistingNetworks();
  if (!existingNetworks.length) {
    throw new Error(
      'No existing networks found. Please create a network first.',
    );
  }
  const choices: ICustomNetworkChoice[] = existingNetworks.map((network) => ({
    value: network.value,
    name: network.name,
  }));
  if (isOptional === true) {
    choices.unshift({
      value: 'skip',
      name: 'Network is optional. Continue to next step',
    });
  }
  choices.push({ value: 'createNetwork', name: 'Create a new network' });
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

export const networkDeletePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  if (args.defaultValue === undefined) {
    throw new Error('Network name is required for the delete prompt.');
  }
  const message = `Are you sure you want to delete the configuration for network "${args.defaultValue}"?`;
  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};
