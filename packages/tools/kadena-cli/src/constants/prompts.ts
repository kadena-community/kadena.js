import { input, select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { program } from 'commander';
import path from 'path';
import { createNetworksCommand } from '../networks/createNetworksCommand.js';
import { ICustomNetworksChoice } from '../networks/networksHelpers.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { getExistingNetworks, getVersion } from '../utils/helpers.js';
import { defaultNetworksPath } from './networks.js';

export const accountPrompt = async () =>
  await input({ message: 'Enter the Kadena k:account' });

export const chainIdPrompt = async () =>
  await input({ message: 'Enter chainId (0-19)' });

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

  // TODO call programmatically
  // execSync(`ts-node-esm -T src/index.ts networks create`, { stdio: 'inherit' })
  // program.parse(['networks', 'create'], { from: 'user' });
  await program.parseAsync(['', '', 'networks', 'create']);

  return await networkPrompt();

  // await createNetworksCommand(program, getVersion());
  // program.parse(['', '', 'networks create']);

  // const networks = program.commands.find(command => command.name() === 'networks');
  // const create = networks?.commands.find(command => command.name() === 'create');
  // // console.log(create);
  // await create?.parseAsync(['', '', 'networks create']);
  // await networkPrompt()

  // return ''; // network?.network || '';
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

export const networkOverwritePrompt = async () =>
  await select({
    message: `A network configuration with this name already exists. Do you want to update it?`,
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
