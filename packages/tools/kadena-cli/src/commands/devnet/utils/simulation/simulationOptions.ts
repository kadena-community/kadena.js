import { Option } from 'commander';
import { z } from 'zod';
import { createOption } from '../../../../utils/createOption.js';

import type { ChainId } from '@kadena/types';
import { simulate as simulationPrompts } from '../../../../prompts/index.js';
export const simulationOptions = {
  //Simulation
  simulationNumberOfAccounts: createOption({
    key: 'simulationNumberOfAccounts' as const,
    prompt: simulationPrompts.numberOfAccountsPrompt,
    validation: z.number(),
    option: new Option(
      '-a, --simulation-number-of-accounts <simulationNumberOfAccounts>',
      'Amount of accounts to be created in the simulation (default: 6)',
    ).argParser((value) => parseInt(value, 10)),
  }),
  simulationTransferInterval: createOption({
    key: 'simulationTransferInterval' as const,
    prompt: simulationPrompts.transferIntervalPrompt,
    validation: z.number(),
    option: new Option(
      '-i, --simulation-transfer-interval <simulationTransferInterval>',
      'Transfer interval in milliseconds (default: 100)',
    ).argParser((value) => parseInt(value, 10)),
  }),

  simulationMaxTransferAmount: createOption({
    key: 'simulationMaxTransferAmount' as const,
    prompt: simulationPrompts.maxTransferAmountPrompt,
    validation: z.number(),
    option: new Option(
      '-m, --simulation-max-transfer-amount <simulationMaxTransferAmount>',
      'Max transfer amount per single transaction of coin (default: 25)',
    ).argParser((value) => parseInt(value, 10)),
  }),

  simulationTokenPool: createOption({
    key: 'simulationTokenPool' as const,
    prompt: simulationPrompts.tokenPoolPrompt,
    validation: z.number(),
    option: new Option(
      '-p, --simulation-token-pool <simulationTokenPool>',
      'Total token pool of coin (default: 1000000)',
    ).argParser((value) => parseInt(value, 10)),
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
      '-c, --simulation-default-chain-id <simulationDefaultChainId>',
      'Default chain id for the simulation (default: 0).',
    ),
  }),

  simulationMaxTime: createOption({
    key: 'simulationMaxTime' as const,
    prompt: simulationPrompts.maxTimePrompt,
    validation: z.number(),
    option: new Option(
      '-t, --simulation-max-time <simulationMaxTime>',
      'Specify the maximum time in milliseconds the simulation will run (default: 7 days)',
    ).argParser((value) => parseInt(value, 10)),
  }),
};
