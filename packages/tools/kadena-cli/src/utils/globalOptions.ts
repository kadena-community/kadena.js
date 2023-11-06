import { Option } from 'commander';
import { z } from 'zod';
import {
  accountPrompt,
  chainIdPrompt,
  networkPrompt,
} from '../constants/prompts.js';
import { loadNetworkConfig } from '../networks/networksHelpers.js';

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

// eslint-disable-next-line @rushstack/typedef-var
export const globalOptions = {
  account: createOption({
    key: 'account' as const,
    prompt: accountPrompt,
    validation: z.string(),
    option: new Option(
      '-a, --account <account>',
      'Receiver (k:) wallet address',
    ),
  }),
  chainId: createOption({
    key: 'chainId' as const,
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
    key: 'network' as const,
    prompt: networkPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --network <network>',
      'Kadena network (e.g. "mainnet")',
    ),
    expand(networkName: string) {
      return loadNetworkConfig(networkName);
    },
  }),
} as const;
