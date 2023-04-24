import { networkMap } from '../utils/networkMap';

import { generate } from './generate';

import { Command, Option } from 'commander';
import { z } from 'zod';

export type ContractGenerateOptions =
  | {
      contract: string;
      clean?: boolean;
      capsInterface?: string;
      api: string;
      chain: number;
      network: keyof typeof networkMap;
    }
  | {
      file: string;
      clean?: boolean;
      capsInterface?: string;
    };

// eslint-disable-next-line @rushstack/typedef-var
const Options = z
  .object({
    file: z.string().optional(),
    contract: z.string().optional(),
    clean: z.boolean().optional(),
    capsInterface: z.string().optional(),
    api: z.string().optional(),
    chain: z.number().optional(),
    network: z.enum(['mainnet', 'testnet']),
  })
  .refine(({ file, contract }) => {
    if (file === undefined && contract === undefined) {
      return false;
    }
    if (file !== undefined && contract !== undefined) {
      return false;
    }
    return true;
  }, 'Error: either file or contract must be specified')
  .refine(({ contract, api: host }) => {
    if (contract !== undefined && host === undefined) {
      return false;
    }
    return true;
  }, 'Error: when providing a contract a host must be specified');

export type TOptions = z.infer<typeof Options>;

export function contractGenerateCommand(
  program: Command,
  version: string,
): void {
  program
    .command('contract-generate')
    .description('Generate client based on a contract')
    .option('-c, --clean', 'Clean existing generated files')
    .option(
      '-i, --caps-interface',
      'Custom name for the interface of the caps. ' +
        'Can be used to create a type definition with a limited set of capabilities.',
    )
    .option('-f, --file <file>', 'Generate d.ts from Pact contract file')
    .option(
      '--contract <contractName>',
      'Generate d.ts from Pact contract from the blockchain',
    )
    .option(
      '--api <api>',
      'The API to use for retrieving the contract, e.g. "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact"',
    )
    .addOption(
      new Option(
        '--chain <chain>',
        'The chainId to retrieve the contract from, e.g. 8. Defaults to 1.',
      )
        .argParser((value) => parseInt(value, 10))
        .default(1),
    )
    .option(
      '--network <network>',
      'The networkId to retrieve the contract from, e.g. "testnet". Defaults to mainnet',
      'mainnet',
    )
    .action((args: ContractGenerateOptions) => {
      try {
        Options.parse(args);
      } catch (e) {
        program.error(
          (e as z.ZodError).errors
            .map((err) => {
              if (err.code === 'invalid_type') {
                return `${err.message} (${err.expected} was ${err.received})`;
              }
              return err.message;
            })
            .reduce((a, b) => `${a}\n${b}`) +
            `\nReceived arguments ${JSON.stringify(args)}` +
            `\n${program.helpInformation(e)}`,
        );
      }

      generate(program, version)(args);
    });
}
