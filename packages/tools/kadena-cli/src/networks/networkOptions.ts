import { Option } from 'commander';
import { z } from 'zod';
import { networks } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';
import { isNotEmptyString } from '../utils/helpers.js';
import { loadNetworkConfig } from './utils/networkHelpers.js';

export const networkOptions = {
  networkName: createOption({
    key: 'networkName' as const,
    prompt: networks.networkNamePrompt,
    validation: z.string(),
    option: new Option(
      '-a, --network-name <networkName>',
      'Kadena network (e.g. "mainnet")',
    ),
    transform: (networkName: string) => {
      const trimmedNetworkName = networkName.trim();
      if (isNotEmptyString(trimmedNetworkName)) {
        return trimmedNetworkName;
      }

      throw new Error('Network name is required');
    },
  }),
  networkId: createOption({
    key: 'networkId' as const,
    prompt: networks.networkIdPrompt,
    validation: z.string(),
    option: new Option(
      '--network-id <networkId>',
      'Kadena network Id (e.g. "mainnet01")',
    ),
    transform: (networkId: string) => {
      return networkId.trim();
    },
  }),
  networkHost: createOption({
    key: 'networkHost' as const,
    prompt: networks.networkHostPrompt,
    validation: z.string(),
    option: new Option(
      '-h, --network-host <networkHost>',
      'Kadena network host (e.g. "https://api.chainweb.com")',
    ),
    transform: (value: string) => {
      // when it's optional and it's empty string and we don't want to validate it
      if (isNotEmptyString(value)) {
        const parse = z.string().url().safeParse(value.trim());
        if (!parse.success) {
          throw new Error(
            'Network host: Invalid URL. Please enter a valid URL.',
          );
        }
      }

      return value.trim();
    },
  }),
  networkExplorerUrl: createOption({
    key: 'networkExplorerUrl' as const,
    prompt: networks.networkExplorerUrlPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-e, --network-explorer-url <networkExplorerUrl>',
      'Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    ),
  }),
  networkOverwrite: createOption({
    key: 'networkOverwrite' as const,
    prompt: networks.networkOverwritePrompt,
    validation: z.string(),
    option: new Option(
      '-o, --network-overwrite <networkOverwrite>',
      'Overwrite existing network configuration (yes/no)',
    ),
  }),
  networkDelete: createOption({
    key: 'networkDelete' as const,
    prompt: networks.networkDeletePrompt,
    validation: z.string(),
    option: new Option(
      '-d, --network-delete <networkDelete>',
      'Delete the configuration for network (yes/no)',
    ),
  }),
  networkDefaultConfirmation: createOption({
    key: 'confirm' as const,
    prompt: networks.networkDefaultConfirmationPrompt,
    validation: z.boolean(),
    option: new Option(
      '-c, --confirm',
      'Confirm to set/unset the network as default',
    ),
  }),
  networkSelectWithNone: createOption({
    key: 'network' as const,
    prompt: networks.networkSelectWithNonePrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand: async (network: string) => {
      try {
        if (network === 'none') return null;

        return await loadNetworkConfig(network);
      } catch (e) {
        throw new Error(
          `No network configuration found for "${network}". Please create a "${network}" network.`,
        );
      }
    },
  }),
};
