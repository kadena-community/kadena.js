import { Option } from 'commander';
import { z } from 'zod';
import { createOption } from './createOption.js';

import type { ChainId } from '@kadena/types';
import { simulate as simulationPrompts } from '../prompts/index.js';
export const simulationOptions = {
  //Simulation
  simulationNumberOfAccounts: createOption({
    key: 'accounts' as const,
    prompt: simulationPrompts.numberOfAccountsPrompt,
    validation: z.number(),
    option: new Option(
      '-na, --accounts <accounts>',
      'Amount of accounts to be created in the simulation.',
    ),
  }),
  simulationTransferInterval: createOption({
    key: 'interval' as const,
    prompt: simulationPrompts.transferIntervalPrompt,
    validation: z.number(),
    option: new Option(
      '-ti, --interval <interval>',
      'Transfer interval in milliseconds.',
    ).argParser((value) => parseInt(value, 10)),
  }),

  simulationMaxTransferAmount: createOption({
    key: 'maxTransferAmount' as const,
    prompt: simulationPrompts.maxTransferAmountPrompt,
    validation: z.number(),
    option: new Option(
      '-mta, --max-transfer-amount <maxTransferAmount>',
      'Max transfer amount per single transaction (coin).',
    ),
  }),

  simulationTokenPool: createOption({
    key: 'tokenPool' as const,
    prompt: simulationPrompts.tokenPoolPrompt,
    validation: z.number(),
    option: new Option(
      '-tp, --token-pool <tokenPool>',
      'Total token pool (coin).',
    ),
  }),
  simulationSeed: createOption({
    key: 'seed' as const,
    prompt: simulationPrompts.seedPrompt,
    validation: z.string(),
    option: new Option('-s, --seed <seed>', 'Seed for the simulation.'),
  }),

  simulationDefaultChainId: createOption({
    key: 'defaultChainId' as const,
    prompt: simulationPrompts.defaultChainIdPrompt,
    validation: z.string(),
    transform: (chainId: string) => {
      return chainId as ChainId;
    },
    option: new Option(
      '-dc, --default-chain-id <defaultChainId>',
      'Default chain id for the simulation (eg. 0).',
    ),
  }),
};
