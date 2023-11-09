import { Option } from 'commander';
import { z } from 'zod';
import {
  accountPrompt,
  chainIdPrompt,
  networkExplorerUrlPrompt,
  networkHostPrompt,
  networkIdPrompt,
  networkNamePrompt,
  networkPrompt,
} from '../constants/prompts.js';
import { loadNetworkConfig } from '../networks/networksHelpers.js';
import { ensureNetworksConfiguration } from './helpers.js';
// import { runNetworksCreate } from '../networks/createNetworksCommand.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createOption = <
  T extends {
    prompt: any;
    validation: any;
    option: Option;
    expand?: (label: string) => any;
  },
>(
  option: T,
) => {
  return (optional: boolean = true) => ({
    ...option,
    validation: optional ? option.validation.optional() : option.validation,
  });
};

export const globalOptions = {
  account: createOption({
    key: 'account',
    prompt: accountPrompt,
    validation: z.string(),
    option: new Option(
      '-a, --account <account>',
      'Receiver (k:) wallet address',
    ),
  }),
  chainId: createOption({
    key: 'chainId',
    prompt: chainIdPrompt,
    validation: z
      .string({
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        invalid_type_error: 'Error: -c, --chain-id must be a number',
      })
      .min(0)
      .max(19),
    option: new Option('-c, --chain-id <chainId>'),
  }),
  network: createOption({
    key: 'network',
    prompt: networkPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand: async (network: string) => {
      await ensureNetworksConfiguration();
      try {
        return loadNetworkConfig(network).network;
      } catch (e) {
        // await runNetworksCreate();
      }
    },
  }),
  networkName: createOption({
    key: 'network',
    prompt: networkNamePrompt,
    validation: z.string(),
    option: new Option('-n, --network <network>', 'Kadena network (e.g. "mainnet")'),
  }),
  networkId: createOption({
    key: 'networkId',
    prompt: networkIdPrompt,
    validation: z.string(),
    option: new Option('-nid, --network-id <networkId>', 'Kadena network Id (e.g. "mainnet01")'),
  }),
  networkHost: createOption({
    key: 'networkHost',
    prompt: networkHostPrompt,
    validation: z.string(),
    option: new Option('-h, --network-host <networkHost>', 'Kadena network host (e.g. "https://api.chainweb.com")'),
  }),
  networkExplorerUrl: createOption({
    key: 'networkExplorerUrl',
    prompt: networkExplorerUrlPrompt,
    validation: z.string().optional(),
    option: new Option('-e, --network-explorer-url <networkExplorerUrl>', 'Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")'),
  }),
} as const;
