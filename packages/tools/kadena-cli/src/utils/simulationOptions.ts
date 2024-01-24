import { Option } from 'commander';
import { z } from 'zod';
import { createOption } from './createOption.js';

import type { ChainId } from '@kadena/types';
import { simulate as simulationPrompts } from '../prompts/index.js';
export const simulationOptions = {
  //Simulation
  simulationNumberOfAccounts: createOption({
    key: 'simulationNumberOfAccounts' as const,
    prompt: simulationPrompts.numberOfAccountsPrompt,
    validation: z.number(),
    option: new Option(
      '-na, --simulation-number-of-accounts <simulationNumberOfAccounts>',
      'Amount of accounts to be created in the simulation.',
    ),
  }),
  simulationTransferInterval: createOption({
    key: 'simulationTransferInterval' as const,
    prompt: simulationPrompts.transferIntervalPrompt,
    validation: z.number(),
    option: new Option(
      '-ti, --simulation-transfer-interval <simulationTransferInterval>',
      'Transfer interval in milliseconds.',
    ).argParser((value) => parseInt(value, 10)),
  }),

  simulationMaxTransferAmount: createOption({
    key: 'simulationMaxTransferAmount' as const,
    prompt: simulationPrompts.maxTransferAmountPrompt,
    validation: z.number(),
    option: new Option(
      '-mta, --simulation-max-transfer-amount <simulationMaxTransferAmount>',
      'Max transfer amount per single transaction (coin).',
    ),
  }),

  simulationTokenPool: createOption({
    key: 'simulationTokenPool' as const,
    prompt: simulationPrompts.tokenPoolPrompt,
    validation: z.number(),
    option: new Option(
      '-tp, --simulation-token-pool <simulationTokenPool>',
      'Total token pool (coin).',
    ),
  }),
  simulationSeed: createOption({
    key: 'simulationSeed' as const,
    prompt: simulationPrompts.seedPrompt,
    validation: z.string(),
    option: new Option(
      '-s, --simulation-seed <simulationSeed>',
      'Seed for the simulation.',
    ),
  }),

  simulationDefaultChainId: createOption({
    key: 'simulationDefaultChainId' as const,
    prompt: simulationPrompts.defaultChainIdPrompt,
    validation: z.string(),
    transform: (chainId: string) => {
      return chainId as ChainId;
    },
    option: new Option(
      '-dc, --simulation-default-chain-id <simulationDefaultChainId>',
      'Default chain id for the simulation (eg. 0).',
    ),
  }),
};
