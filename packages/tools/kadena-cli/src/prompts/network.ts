import type { ChainId } from '@kadena/types';
import { z } from 'zod';
import { chainIdValidation } from '../account/utils/accountHelpers.js';
import { KADENA_DIR, MAX_CHAIN_VALUE } from '../constants/config.js';
import { defaultNetworksPath } from '../constants/networks.js';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import {
  ensureNetworksConfiguration,
  getNetworksInOrder,
  loadNetworkConfig,
} from '../networks/utils/networkHelpers.js';
import { services } from '../services/index.js';
import { KadenaError } from '../services/service-error.js';
import type { IPrompt } from '../utils/createOption.js';
import {
  getExistingNetworks,
  isAlphabetic,
  isNotEmptyString,
} from '../utils/helpers.js';
import { input, select } from '../utils/prompts.js';
import { getInputPrompt } from './generic.js'; // Importing getInputPrompt from another file

export const chainIdPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = (args.defaultValue as string) || '0';
  return (await input({
    message: `Enter ChainId (0-${MAX_CHAIN_VALUE})`,
    default: defaultValue,
    validate: function (input) {
      const chainId = parseInt(input.trim(), 10);
      const result = chainIdValidation.safeParse(chainId);
      if (!result.success) {
        const formatted = result.error.format();
        return `ChainId: ${formatted._errors[0]}`;
      }
      return true;
    },
  })) as ChainId;
};

export const networkNamePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = (previousQuestions.network as string) || undefined;
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

export const networkIdPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue as string;
  const validate = function (input: string): string | boolean {
    if (isOptional) return true;

    if (!isNotEmptyString(input.trim())) return 'Network id is required.';

    return true;
  };

  return await getInputPrompt(
    'Enter a network id (e.g. "mainnet01")',
    defaultValue,
    validate,
  );
};

export const networkHostPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue as string;
  const validate = function (input: string): string | boolean {
    if (isOptional && !isNotEmptyString(input.trim())) return true;

    const parse = z.string().url().safeParse(input);

    if (!parse.success)
      return 'Network host: Invalid URL. Please enter a valid URL.';

    return true;
  };

  return await getInputPrompt(
    'Enter Kadena network host (e.g. "https://api.chainweb.com")',
    defaultValue,
    validate,
  );
};

export const networkExplorerUrlPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue as string;
  return await getInputPrompt(
    'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    defaultValue,
  );
};

export const networkOverwritePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const networkName =
    args.defaultValue ?? previousQuestions.networkName ?? args.networkName;

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

export const networkSelectPrompt: IPrompt<string> = async (
  prev,
  args,
  isOptional,
) => {
  const networkText = (args.networkText as string) ?? 'Select a network';
  const existingNetworks: ICustomNetworkChoice[] = await getExistingNetworks();

  const allowedNetworks =
    prev.allowedNetworks !== undefined
      ? (prev.allowedNetworks as string[])
      : [];

  const filteredNetworks = existingNetworks.filter((network) =>
    allowedNetworks.length > 0
      ? allowedNetworks.includes(network.name ?? '')
      : true,
  );

  if (!filteredNetworks.length) {
    throw new Error(
      'No networks found. To create one, use: `kadena networks create`. To set default networks, use: `kadena config init`.',
    );
  }

  const networksInOrder = await getNetworksInOrder(filteredNetworks);

  const choices: ICustomNetworkChoice[] = networksInOrder.map((network) => ({
    value: network.value,
    name: network.name,
  }));

  if (isOptional === true) {
    choices.unshift({
      value: 'skip',
      name: 'Network is optional. Continue to next step',
    });
  }

  const selectedNetwork = await select({
    message: networkText,
    choices: choices,
  });

  return selectedNetwork;
};

const getEnsureExistingNetworks = async (): Promise<ICustomNetworkChoice[]> => {
  if (defaultNetworksPath === null || KADENA_DIR === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const isNetworksFolderExists =
    await services.filesystem.directoryExists(defaultNetworksPath);
  if (
    !isNetworksFolderExists ||
    (await services.filesystem.readDir(defaultNetworksPath)).length === 0
  ) {
    await ensureNetworksConfiguration(KADENA_DIR);
  }
  const existingNetworks: ICustomNetworkChoice[] = await getExistingNetworks();

  if (!existingNetworks.length) {
    throw new Error(
      'No existing networks found. To create one, use: `kadena networks create`. To set default networks, use: `kadena config init',
    );
  }
  return existingNetworks;
};

export const networkSelectOnlyPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const existingNetworks = await getEnsureExistingNetworks();

  const allowedNetworkIds =
    previousQuestions.allowedNetworkIds !== undefined
      ? (previousQuestions.allowedNetworkIds as string[])
      : [];

  const existingNetworksData = (
    await Promise.all(
      existingNetworks.map(async (network) => ({
        ...network,
        ...(await loadNetworkConfig(network.value)),
      })),
    )
  ).flat();

  const filteredNetworks = existingNetworksData.filter((network) =>
    allowedNetworkIds.length > 0
      ? allowedNetworkIds.includes(network.networkId)
      : true,
  );

  if (!filteredNetworks.length) {
    throw new Error(
      'No supported networks found. To create one, use: `kadena networks create`. To set default networks, use: `kadena config init',
    );
  }

  const networksInOrder = await getNetworksInOrder(filteredNetworks);

  const choices: ICustomNetworkChoice[] = networksInOrder.map((network) => ({
    value: network.value,
    name: network.name,
  }));

  const selectedNetwork = await select({
    message: 'Select a network',
    choices: choices,
  });

  return selectedNetwork;
};

export const networkSelectWithNonePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
): Promise<string> => {
  const defaultNetwork = previousQuestions.defaultNetwork;
  const existingNetworks = await getEnsureExistingNetworks();

  const choices: ICustomNetworkChoice[] = existingNetworks.map((network) => ({
    value: network.value,
    name: network.name,
  }));

  if (isNotEmptyString(defaultNetwork)) {
    choices.unshift({
      value: 'none',
      name: 'Remove default network',
    });
  }

  const selectedNetwork = await select({
    message: 'Select a network',
    choices: choices,
  });

  return selectedNetwork;
};

export const networkDeletePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue ?? previousQuestions.network;
  if (previousQuestions.network === undefined) {
    throw new Error('Network name is required for the delete prompt.');
  }

  let message = `Are you sure you want to delete the configuration for network "${defaultValue}"?`;
  if (isNotEmptyString(previousQuestions.isDefaultNetwork)) {
    message += `\nThis is a "default network". If you delete it, then the default network settings will also be deleted.`;
  }
  message += '\n  type "yes" to confirm or "no" to cancel and press enter. \n';
  const answer = await input({
    message: message,
    validate: (input) => {
      if (input === 'yes' || input === 'no') {
        return true;
      }
      return 'Please type "yes" to confirm or "no" to cancel.';
    },
  });
  return answer;
};

export const networkDefaultConfirmationPrompt: IPrompt<boolean> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = args.defaultValue ?? previousQuestions.network;
  if (defaultValue === undefined && previousQuestions.action === 'set') {
    throw new Error('Network name is required to set the default network.');
  }

  const message =
    previousQuestions.action === 'set'
      ? `Are you sure you want to set "${defaultValue}" as the default network?`
      : `Are you sure you want to remove the "${defaultValue}" default network?`;
  return await select({
    message,
    choices: [
      { value: true, name: 'Yes' },
      { value: false, name: 'No' },
    ],
  });
};
