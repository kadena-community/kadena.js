import { rootPath } from '../constants/config';
import { displayConfig, getConfig } from '../utils/globalConfig';
import { collectResponses } from '../utils/helpers';
import { processZodErrors } from '../utils/process-zod-errors';

import { createConfig } from './createConfig';

import { input, select } from '@inquirer/prompts';
import clear from 'clear';
import { Command, Option } from 'commander';
import debug from 'debug';
import { existsSync } from 'fs';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
const Options = z.object({
  publicKey: z.string().min(10).optional(),
  privateKey: z.string().min(10).optional(),
  chainId: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(19)
    .optional(),
  network: z.enum(['mainnet', 'testnet', 'devnet']),
  networkId: z.string().optional(),
  networkHost: z.string().optional(),
  networkExplorerUrl: z.string().optional(),
  kadenaNamesApiEndpoint: z.string().optional(),
});

export type TOptions = z.infer<typeof Options>;

interface IQuestionType<K extends keyof TOptions> {
  key: K;
  question: () => Promise<TOptions[K]>;
}

interface IChoice<Value> {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

const networkChoices: IChoice<string>[] = [
  { value: 'mainnet', name: 'Mainnet' },
  { value: 'testnet', name: 'Testnet' },
  { value: 'devnet', name: 'Devnet' },
];

const generateQuestions = (
  args: Partial<TOptions>,
): Array<IQuestionType<keyof TOptions>> => {
  const questionsList: Array<IQuestionType<keyof TOptions>> = [
    {
      key: 'publicKey',
      question: () => input({ message: 'Enter your publicKey' }),
    },
    {
      key: 'privateKey',
      question: () => input({ message: 'Enter your privateKey' }),
    },
    {
      key: 'chainId',
      question: async () => await input({ message: 'Enter chainId (0-19)' }),
    },
    {
      key: 'network',
      question: async () => {
        return await select({
          message: 'Choose your network',
          choices: networkChoices,
        });
      },
    },
    {
      key: 'networkId',
      question: () =>
        input({ message: 'Enter Kadena network Id (e.g. "mainnet01")' }),
    },
    {
      key: 'networkHost',
      question: () =>
        input({
          message:
            'Enter Kadena network host (e.g. "https://api.chainweb.com")',
        }),
    },
    {
      key: 'networkExplorerUrl',
      question: () =>
        input({
          message:
            'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
        }),
    },
    {
      key: 'kadenaNamesApiEndpoint',
      question: () =>
        input({
          message:
            'Enter Kadena Names Api Endpoint (e.g. "https://www.kadenanames.com/api/v1")',
        }),
    },
  ];

  return questionsList.filter((q) => {
    if (q.key === 'network') {
      return args[q.key] === 'mainnet';
    }
    return args[q.key] === undefined;
  });
};

async function shouldProceedWithConfigInit(): Promise<boolean> {
  if (existsSync(rootPath)) {
    const overwrite = await select({
      message: `Your config already exists. Do you want to update it?`,
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });
    return overwrite === 'yes';
  }
  return true;
}

async function runConfigInitialization(
  program: Command,
  version: string,
  args: TOptions,
): Promise<void> {
  try {
    Options.parse(args);
    const responses = await collectResponses<TOptions>(generateQuestions(args));
    const finalConfig = { ...args, ...responses };

    await createConfig(program, version)(finalConfig).catch(console.error);
    displayConfig(getConfig());

    const proceed = await select({
      message: 'Is the above configuration correct?',
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });

    if (proceed === 'no') {
      clear(true);
      console.log("Let's restart the configuration process.");
      await runConfigInitialization(program, version, args);
    } else {
      console.log('Configuration complete. Goodbye!');
    }
  } catch (e) {
    processZodErrors(program, e, args);
  }
}

export function initCommand(program: Command, version: string): void {
  program
    .command('init')
    .description('Configuration of the CLI. E.g. network, config directory.')
    .option('-pb, --publicKey <publicKey>', 'Set your publicKey')
    .option('-pr, --privateKey <privateKey>', 'Set your privateKey')
    .addOption(
      new Option('-c, --chainId <number>', 'Chain to retrieve from (default 1)')
        .argParser((value) => parseInt(value, 10))
        .default(1),
    )
    .option('-n, --network <network>', 'Network to retrieve from', 'mainnet')
    .option(
      '-nid, --networkId <networkId>',
      'Kadena network Id (e.g. "mainnet01")',
    )
    .option(
      '-h, --networkHost <networkHost>',
      'Kadena network host (e.g. "https://api.chainweb.com")',
    )
    .option(
      '-e, --networkExplorerUrl <networkExplorerUrl>',
      'Kadena network explorer (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    )
    .option(
      '-kdn, --kadenaNamesApiEndpoint <kadenaNamesApiEndpoint>',
      'Kadena Names Api (e.g. "https://www.kadenanames.com/api/v1")',
    )
    .action(async (args: TOptions) => {
      debug('init:action')({ args });

      if (!(await shouldProceedWithConfigInit())) {
        console.log('Config initialization aborted.');
        return;
      }

      await runConfigInitialization(program, version, args);
    });
}
