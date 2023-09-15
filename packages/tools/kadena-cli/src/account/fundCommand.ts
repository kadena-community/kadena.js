import { networkChoices } from '../utils/client';
// import { displayConfig } from '../utils/display';
// import { getConfig } from '../utils/globalConfig';
import { collectResponses, IQuestion } from '../utils/helpers';
import { processZodErrors } from '../utils/process-zod-errors';

import { makeFundRequest } from './makeFundRequest';

import { input, select } from '@inquirer/prompts';
import clear from 'clear';
import { Command, Option } from 'commander';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
const FundOptions = z.object({
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
  receiver: z
    .string()
    .min(60, { message: 'Wallet must be 60 or more characters long' })
    .startsWith('k:', { message: 'Wallet should start with k:' }),
});

export type TFundOptions = z.infer<typeof FundOptions>;

const questions: IQuestion<TFundOptions>[] = [
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
      await input({
        default: String(config.chainId),
        message: 'Enter chainId (0-19)',
      }),
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
    prompt: async (config) =>
      await input({
        default: config.publicKey,
        message:
          'Enter your Public key (e.g. "a1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9a0b1c2d3e4f5g6h7i8j9k0")',
      }),
  },
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
    .option('-pb, --publicKey <publicKey>', 'Set your Public key')
    .addOption(
      new Option('-c, --chainId <number>', 'Chain to retrieve from (default 1)')
        .argParser((value) => parseInt(value, 10))
        .default(1),
    )
    .addOption(
      new Option('-n, --network <network>', 'Network to retrieve from'),
    )
    .option(
      '-nid, --networkId <networkId>',
      'Kadena network Id (e.g. "testnet04")',
    )
    .option('-r, --receiver <receiver>', 'Receiver (k:) wallet address')
    .action(async (args: TFundOptions) => {
      try {
        clear();
        let responses = {} as TFundOptions;

        // const { network } = getConfig();
        const network = 'bla';

        if (network?.toLowerCase() !== 'mainnet') {
          //  displayConfig({ chainId, network });
          const proceed = await select({
            message: 'Is the above configuration correct?',
            choices: [
              { value: 'yes', name: 'Yes' },
              { value: 'no', name: 'No' },
            ],
          });

          clear(true);
          responses = await collectResponses(
            proceed === 'no' ? {} : args,
            questions,
          );
        } else {
          responses = await collectResponses(args, questions);
        }

        // conversion needed for chainId
        const requestArgs = {
          ...args,
          ...responses,
          chainId:
            typeof responses.chainId === 'string'
              ? Number(responses.chainId)
              : responses.chainId,
        };

        FundOptions.parse(requestArgs);

        await makeFundRequest(requestArgs);
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
