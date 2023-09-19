import { networkChoices } from '../utils/client';
import { getContext } from '../utils/globalConfig';
import type { IQuestion } from '../utils/helpers';
import { collectResponses, getPubKeyFromAccount } from '../utils/helpers';
import { processZodErrors } from '../utils/process-zod-errors';

import { makeFundRequest } from './makeFundRequest';

import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import { Option } from 'commander';
import { z, ZodError } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
const FundOptions = z.object({
  receiver: z
    .string()
    .min(60, { message: 'Wallet must be 60 or more characters long' })
    .startsWith('k:', { message: 'Wallet should start with k:' }),
  chainId: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(19),
  network: z.enum(['testnet', 'devnet']),
  networkId: z.string({}),
  publicKey: z
    .string({
      required_error: 'Public key is required',
    })
    .min(10),
});

export type TFundOptions = z.infer<typeof FundOptions>;

const questions: IQuestion<TFundOptions>[] = [
  {
    key: 'receiver',
    prompt: async (config, prevAnswers, args) => {
      const answer = await select({
        message: 'Which account to use?',
        choices: [{ value: 'fakeaccuntname' }].filter(
          (x) => x.value !== undefined,
        ),
      });

      if (answer !== undefined) {
        return answer;
      }

      return await input({
        message:
          'Enter the k:receiver wallet address that will receive the funds',
      });
    },
  },
  {
    key: 'network',
    prompt: async () =>
      await select({
        message: 'Choose your network',
        choices: networkChoices.filter((choice) => choice.value !== 'mainnet'),
      }),
  },
  {
    key: 'chainId',
    prompt: async (config) =>
      parseInt(
        await input({
          default: String(config.chainId),
          message: 'Enter chainId (0-19)',
        }),
        10,
      ),
  },
  {
    key: 'networkId',
    prompt: async (config, previousAnswers) => {
      return await input({
        default: config.networkId,
        message: `Enter ${previousAnswers.network} network Id (e.g. "${previousAnswers.network}04")`,
      });
    },
  },
  {
    key: 'publicKey',
    prompt: async (config, answers, args) => {
      console.log('chainid type', typeof answers.chainId);
      console.log({ answers });

      const answer = await select({
        message: 'Which key to use?',
        choices: [
          {
            name: `use key from 'receiver' ${getPubKeyFromAccount(
              args.receiver !== undefined ? args.receiver : '',
            )}`,
            value: args.receiver?.split(':')[1],
          },
          {
            name: 'custom',
            value: '',
          },
        ].filter((x) => x.value !== undefined),
      });

      if (answer !== undefined && answer !== '') {
        console.log(`using ${answer}`);
        return answer;
      }

      return await input({
        default: config.publicKey,
        message:
          'Enter your Public key (e.g. "a1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9a0b1c2d3e4f5g6h7i8j9k0")',
      });
    },
  },
];

export function fundCommand(program: Command, version: string): void {
  program
    .command('fund')
    .description('fund an account on a devnet or testnet')
    .option('-r, --receiver <receiver>', 'Receiver (k:) wallet address')
    .option('-pb, --publicKey <publicKey>', 'Set your Public key')
    .addOption(
      new Option(
        '-c, --chainId <number>',
        'Chain to retrieve from (default 1)',
      ).argParser((value) => parseInt(value, 10)),
    )
    .addOption(
      new Option('-n, --network <network>', 'Network to retrieve from'),
    )
    .option(
      '-nid, --networkId <networkId>',
      'Kadena network Id (e.g. "testnet04")',
    )
    .action(async (args: TFundOptions) => {
      try {
        const requestArgs = {
          ...args,
          ...(await collectResponses(args, questions)),
        };

        const context = getContext();

        if (context.toLowerCase() === 'mainnet') {
          console.log(chalk.red('Cannot fund accounts on mainnet'));
          return;
        }

        FundOptions.parse(requestArgs);

        await makeFundRequest(requestArgs);
      } catch (e) {
        if (e instanceof ZodError) {
          processZodErrors(program, e, args);
          return;
        }
        throw e;
      }
    });
}
