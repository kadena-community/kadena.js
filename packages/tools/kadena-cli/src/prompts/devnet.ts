import { program } from 'commander';
import path from 'path';
import type { ICustomDevnetsChoice } from '../commands/devnet/utils/devnetHelpers.js';
import { defaultDevnetsPath } from '../constants/devnets.js';
import { services } from '../services/index.js';
import type { IPrompt } from '../utils/createOption.js';
import { getExistingDevnets } from '../utils/helpers.js';
import { input, select } from '../utils/prompts.js';

export const devnetOverwritePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  return await select({
    message:
      'A devnet configuration with this name already exists. Do you want to update it?',
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const devnetNamePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const containerName = await input({
    message: 'Enter a devnet name (e.g. "devnet"):',
    validate: function (input) {
      if (input.trim().length === 0) {
        return 'Please specify a name for your devnet.';
      }
      return true;
    },
  });

  const filePath = path.join(defaultDevnetsPath, `${containerName}.yaml`);
  if (await services.filesystem.fileExists(filePath)) {
    const overwrite = await devnetOverwritePrompt(
      previousQuestions,
      args,
      isOptional,
    );
    if (overwrite === 'no') {
      return await devnetNamePrompt(previousQuestions, args, isOptional);
    }
  }

  return containerName;
};

export const devnetPortPrompt: IPrompt<number> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const port = await input({
    default: '8080',
    message: 'Enter a port number to forward to the Chainweb node API:',
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

export const devnetUseVolumePrompt: IPrompt<boolean> = async (
  previousQuestions,
  args,
  isOptional,
) =>
  await select({
    message: 'Would you like to create a persistent volume?',
    choices: [
      { value: false, name: 'No' },
      { value: true, name: 'Yes' },
    ],
  });

export const devnetMountPactFolderPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) =>
  await input({
    default: '',
    message:
      'Enter the relative path to a folder containing your Pact files to mount (e.g. ./pact) or leave empty to skip:',
  });

export const devnetVersionPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) =>
  await input({
    default: 'latest',
    message:
      'Enter the version of the kadena/devnet image you would like to use:',
  });

export const devnetSelectPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const existingDevnets: ICustomDevnetsChoice[] = await getExistingDevnets();

  if (existingDevnets.length > 0) {
    return await select({
      message: 'Select a devnet:',
      choices: existingDevnets,
    });
  }

  // At this point there is no devnet defined yet.
  // Create and select a new devnet.
  await program.parseAsync(['', '', 'devnet', 'create']);

  return await devnetSelectPrompt(previousQuestions, args, isOptional);
};

export const devnetDeletePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) =>
  await select({
    message: 'Are you sure you want to delete this devnet?',
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });

export const devnetPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const existingDevnets: ICustomDevnetsChoice[] = await getExistingDevnets();

  if (existingDevnets.length > 0) {
    const selectedDevnet = await select({
      message: 'Select a devnet:',
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

  return await devnetPrompt(previousQuestions, args, isOptional);
};
