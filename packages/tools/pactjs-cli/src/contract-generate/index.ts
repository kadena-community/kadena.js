import { generate } from './generate';

import { Command } from 'commander';
import { z } from 'zod';

export type ContractGenerateOptions =
  | {
      contract: string;
      clean: boolean;
      capsInterface: string | undefined;
    }
  | {
      file: string;
      clean: boolean;
      capsInterface: string | undefined;
    };

// eslint-disable-next-line @rushstack/typedef-var
const Options = z
  .object({
    file: z.string().optional(),
    contract: z.string().optional(),
    clean: z.boolean().optional(),
    capsInterface: z.string().optional(),
  })
  .refine(({ file, contract }) => {
    if (file === undefined && contract === undefined) {
      return false;
    }
    if (file !== undefined && contract !== undefined) {
      return false;
    }
    return true;
  }, 'Error: either file or contract must be specified');

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
