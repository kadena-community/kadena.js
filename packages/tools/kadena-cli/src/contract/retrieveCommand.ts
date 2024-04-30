import { processZodErrors } from '../utils/processZodErrors.js';

import { retrieveContract } from './retrieveContract.js';

import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';
import { MAX_CHAIN_VALUE } from '../constants/config.js';
import { log } from '../utils/logger.js';

// eslint-disable-next-line @rushstack/typedef-var
const Options = z.object({
  module: z.string({
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    invalid_type_error: 'Error: -m, --module must be a string',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    required_error: 'Error: -m, --module is required',
  }),
  out: z.string({
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    invalid_type_error: 'Error: -o, --out must be a string',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    required_error: 'Error: -o, --out is required',
  }),
  api: z.string({
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    invalid_type_error: 'Error: --api must be a string',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    required_error: 'Error: --api is required',
  }),
  network: z.enum(['mainnet', 'testnet']),
  chain: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(MAX_CHAIN_VALUE),
});

export type TOptions = z.infer<typeof Options>;

export function retrieveCommand(program: Command, version: string): void {
  program
    .command('retrieve')
    .description(
      'Retrieve contract from a chainweb-api in a /local call (see also: https://github.com/kadena-io/chainweb-node#configuring-running-and-monitoring-the-health-of-a-chainweb-node).',
    )
    .option(
      '-m, --module <module>',
      'The module you want to retrieve (e.g. "coin")',
    )
    .option('-o, --out <file>', 'File to write the contract to')
    .option(
      '--api <url>',
      'API to retrieve from (e.g. "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact")',
    )
    .option(
      '-n, --network <network>',
      'Network to retrieve from (default "mainnet")',
      'mainnet',
    )
    .addOption(
      new Option('-c, --chain <number>', 'Chain to retrieve from (default 1)')
        .argParser((value) => parseInt(value, 10))
        .default(1),
    )
    .action(async (args: TOptions) => {
      log.debug('retrieve-contract:action', { args });
      try {
        Options.parse(args);
      } catch (e) {
        processZodErrors(program, e, args);
      }
      await retrieveContract(program, version)(args).catch(log.error);
    });
}
