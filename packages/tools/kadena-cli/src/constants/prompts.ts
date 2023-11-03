import { input, select } from "@inquirer/prompts";
import { ICustomNetworksChoice } from "../networks/networksHelpers.js";
import { getExistingNetworks } from "../utils/helpers.js";
import { runNetworksCreate } from "../networks/createNetworksCommand.js";

export const accountPrompt = async () => await input({ message: 'Enter the Kadena k:account' });

export const chainIdPrompt = async () =>
  parseInt(await input({ message: 'Enter chainId (0-19)' }), 10);

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
  const network = await runNetworksCreate();

  return network || '';
};
