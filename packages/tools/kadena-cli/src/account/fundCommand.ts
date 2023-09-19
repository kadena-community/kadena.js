import { displayConfig } from '../utils/display';
import { getConfig, getContext } from '../utils/globalConfig';
import type { IQuestion } from '../utils/helpers';
import { collectResponses } from '../utils/helpers';
import { processZodErrors } from '../utils/process-zod-errors';

import { makeFundRequest } from './makeFundRequest';

import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import clear from 'clear';
import type { Command } from 'commander';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
const FundOptions = z.object({
  receiver: z
    .string()
    .min(60, { message: 'Wallet must be 60 or more characters long' })
    .startsWith('k:', { message: 'Wallet should start with k:' }),
});

export type TFundOptions = z.infer<typeof FundOptions>;

const questions: IQuestion<TFundOptions>[] = [
  {
    key: 'receiver',
    prompt: async () =>
      await input({
        message:
          'Enter the k:receiver wallet addess that will receive the funds',
      }),
  },
];

export function fundCommand(program: Command, version: string): void {
  program
    .command('fund')
    .description('fund an account on a devnet or testnet')
    .option('-r, --receiver <receiver>', 'Receiver (k:) wallet address')
    .action(async (args: TFundOptions) => {
      try {
        clear();
        let responses = {} as TFundOptions;

        const context = getContext();

        if (context.toLowerCase() !== 'mainnet') {
          displayConfig(getConfig(), ['publicKey', 'chainId', 'networkId']);
          const proceed = await select({
            message: 'Is the above configuration correct?',
            choices: [
              { value: 'yes', name: 'Yes' },
              { value: 'no', name: 'No' },
            ],
          });

          clear(true);
          if (proceed === 'no') {
            console.log(
              chalk.red(
                'Please update your config by running "kda config init"',
              ),
            );
            return;
          }
        } else {
          responses = await collectResponses(args, questions);
        }

        const requestArgs = {
          ...args,
          ...responses,
        };

        FundOptions.parse(requestArgs);

        await makeFundRequest(requestArgs);
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
