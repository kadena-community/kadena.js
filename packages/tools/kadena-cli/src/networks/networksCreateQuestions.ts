import { standardNetworks } from '../constants/networks';
import type { IQuestion } from '../utils/helpers';
import {
  capitalizeFirstLetter,
  getExistingNetworks,
  isAlphabetic,
  isAlphanumeric,
} from '../utils/helpers';

import { input, select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const NetworksCreateOptions = z.object({
  network: z.string(),
  networkId: z.string().optional(),
  networkHost: z.string().optional(),
  networkExplorerUrl: z.string().optional(),
});

export type TNetworksCreateOptions = z.infer<typeof NetworksCreateOptions>;

interface INetworkManageQuestionsQuestions
  extends Pick<IQuestion<TNetworksCreateOptions>, 'key' | 'prompt'> {}

interface ICustomChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export async function askForNetwork(): Promise<string> {
  const existingNetworks: ICustomChoice[] = getExistingNetworks();

  const prefixedStandardNetworks: ICustomChoice[] = standardNetworks.map(
    (network) => {
      return {
        value: network,
        name: network,
      } as ICustomChoice;
    },
  );

  const allNetworkChoices: ICustomChoice[] = [
    ...existingNetworks,
    ...prefixedStandardNetworks,
  ]
    .filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i)
    .map((network) => {
      return {
        value: network.value,
        name: capitalizeFirstLetter(network.value),
      };
    });

  const networkChoice = await select({
    message: 'Select an existing network or create a new one:',
    choices: [
      ...allNetworkChoices,
      { value: 'CREATE_NEW', name: 'Create a New Network' } as ICustomChoice,
    ],
  });

  if (networkChoice === 'CREATE_NEW') {
    const newNetworkName = await input({
      default: 'testnet',
      validate: function (input) {
        if (input === '') {
          return 'Network name cannot be empty! Please enter something.';
        }
        if (!isAlphabetic(input)) {
          return 'Network name must be alphabetic! Please enter a valid name.';
        }
        return true;
      },
      message: 'Enter the name for your new network:',
    });
    return newNetworkName.toLowerCase();
  }

  return networkChoice.toLowerCase();
}

export const networksCreateQuestions: IQuestion<TNetworksCreateOptions>[] = [
  {
    key: 'network',
    prompt: async () => await askForNetwork(),
  },
  {
    key: 'networkId',
    prompt: async (config, previousAnswers, args) => {
      const network =
        previousAnswers.network !== undefined
          ? previousAnswers.network
          : args.network;
      return await input({
        default: `${network}01`,
        message: `Enter ${network} network Id (e.g. "${network}01")`,
        validate: function (input) {
          if (!isAlphanumeric(input)) {
            return 'NetworkId must be alphanumeric! Please enter a valid name.';
          }
          return true;
        },
      });
    },
  },
  {
    key: 'networkHost',
    prompt: async () =>
      await input({
        message: 'Enter Kadena network host (e.g. "https://api.chainweb.com")',
      }),
  },
  {
    key: 'networkExplorerUrl',
    prompt: async () =>
      await input({
        message:
          'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
      }),
  },
];

export const networkManageQuestions: INetworkManageQuestionsQuestions[] = [
  ...networksCreateQuestions.filter((question) => question.key !== 'network'),
];
