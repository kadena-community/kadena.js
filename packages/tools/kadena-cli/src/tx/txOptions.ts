import { Option } from 'commander';

import { load as loadYaml } from 'js-yaml';
import { join } from 'node:path';
import { z } from 'zod';
import { tx } from '../prompts/index.js';
import {
  templateDataPrompt,
  templateVariables,
  txRequestKeyPrompt,
  txTransactionNetworks,
} from '../prompts/tx.js';
import { services } from '../services/index.js';
import { createOption } from '../utils/createOption.js';
import { getVariablesByTemplate } from './utils/template.js';
import { parseInput, requestKeyValidation } from './utils/txHelpers.js';

export const txOptions = {
  selectTemplate: createOption({
    key: 'template',
    option: new Option(
      '-t, --template <template>',
      'Filepath of ktpl template to create a transaction from',
    ),
    validation: z.string(),
    prompt: tx.selectTemplate,
    expand: getVariablesByTemplate,
  }),
  templateData: createOption({
    key: 'templateData',
    validation: z.string(),
    option: new Option(
      '-d, --template-data <templateData>',
      'Filepath of JSON or YAML file to use as template data',
    ),
    prompt: templateDataPrompt,
    async expand(filePath) {
      if (filePath === undefined) return null;
      const absolutePath = join(process.cwd(), filePath);
      const exists = await services.filesystem.fileExists(absolutePath);
      const file = await services.filesystem.readFile(
        exists ? absolutePath : filePath,
      );
      if (file === null) return null;
      let parsed: unknown;
      try {
        parsed = JSON.parse(file) as unknown;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      try {
        parsed = loadYaml(file) as unknown;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      const validated = z
        .record(z.union([z.string(), z.number()]))
        .safeParse(parsed);
      if (validated.success) return validated.data;
      else return null;
    },
  }),
  templateVariables: createOption({
    key: 'templateVariables',
    validation: z.object({}).passthrough(),
    option: new Option(
      '--template-variables <templateVariables>',
      'Dynamic placeholder flag for template data, do not use this flag directly',
    ),
    prompt: templateVariables,
    allowUnknownOptions: true,
    // TODO:
    // Transform repeats the same logic as in the prompt
    // This is because prompt can be skipped entirely if quiet=true
    // But prompt still needs the logic to prevent prompting known variables
    transform: async (value, args) => {
      const variableValues: Record<string, string> = value ?? {};
      const { values, variables, data } = args as {
        values: string[];
        variables: string[];
        data: Record<string, unknown>;
      };
      for (const variable of variables) {
        // Prioritize variables from data file
        if (Object.hasOwn(data, variable)) {
          variableValues[variable] = String(data[variable]);
          continue;
        }
        // Find variables in cli arguments
        const match = values.find((value) =>
          value.startsWith(`--${variable}=`),
        );
        if (match !== undefined) variableValues[variable] = match.split('=')[1];
      }
      return variableValues;
    },
  }),

  txUnsignedCommand: createOption({
    key: 'txUnsignedCommand',
    prompt: tx.txUnsignedCommandPrompt,
    validation: tx.IUnsignedCommandSchema,
    option: new Option(
      '-m, --tx-unsigned-command <txUnsignedCommand>',
      'enter your unsigned command to sign',
    ),
  }),
  txUnsignedTransactionFile: createOption({
    key: 'txUnsignedTransactionFile',
    prompt: tx.transactionSelectPrompt,
    validation: tx.IUnsignedCommandSchema,
    option: new Option(
      '-u, --tx-unsigned-transaction-file <txUnsignedTransactionFile>',
      'provide your unsigned transaction file to sign',
    ),
  }),
  txUnsignedTransactionFiles: createOption({
    key: 'txUnsignedTransactionFiles',
    prompt: tx.transactionsSelectPrompt,
    validation: z.array(z.string()),
    option: new Option(
      '-u, --tx-unsigned-transaction-files <txUnsignedTransactionFiles>',
      'provide your unsigned transaction file(s) to sign',
    ),
    transform: async (
      txUnsigedTransactionFiles: string | string[],
    ): Promise<string[]> => {
      if (typeof txUnsigedTransactionFiles === 'string') {
        return parseInput(txUnsigedTransactionFiles);
      }
      return txUnsigedTransactionFiles;
    },
  }),
  txSignedTransactionFile: createOption({
    key: 'txSignedTransactionFile',
    prompt: tx.transactionSelectPrompt,
    validation: tx.ISignedCommandSchema,
    option: new Option(
      '-s, --tx-signed-transaction-file <txSignedTransactionFile>',
      'provide your signed transaction file',
    ),
  }),
  txSignedTransactionFiles: createOption({
    key: 'txSignedTransactionFiles',
    prompt: tx.transactionsSelectPrompt,
    validation: z.union([z.array(z.string()), z.string()]),
    option: new Option(
      '-s, --tx-signed-transaction-files <txSignedTransactionFiles>',
      'provide your signed transaction file',
    ),
    transform: async (
      txSignedTransactionFiles: string | string[],
    ): Promise<string[]> => {
      if (typeof txSignedTransactionFiles === 'string') {
        return parseInput(txSignedTransactionFiles);
      }
      return txSignedTransactionFiles;
    },
  }),
  txTransactionNetwork: createOption({
    key: 'txTransactionNetwork',
    validation: z.array(z.string()),
    option: new Option(
      '-n, --tx-transaction-network <txTransactionNetwork>',
      'Kadena networks comma seperated list in order of transaction.  (e.g. "mainnet, testnet, devnet, ...")',
    ),
    transform: async (value: string | string[]): Promise<string[]> => {
      return parseInput(value);
    },
    prompt: txTransactionNetworks,
  }),
  txSignWith: createOption({
    key: 'txSignWith',
    prompt: tx.selectSignMethodPrompt,
    validation: z.string(),
    option: new Option(
      '-s, --tx-sign-with <txSignWith>',
      'Select a signing method',
    ),
  }),
  txPoll: createOption({
    key: 'txPoll' as const,
    prompt: ({ poll }): boolean => {
      return poll === true || poll === 'true' || false;
    },
    validation: z.boolean().optional(),
    option: new Option('-p, --poll', 'Poll for transaction status'),
  }),
  requestKey: createOption({
    key: 'requestKey',
    prompt: txRequestKeyPrompt,
    defaultIsOptional: false,
    validation: requestKeyValidation,
    option: new Option(
      '-k, --request-key <requestKey>',
      'Request key of the transaction',
    ),
  }),
  holes: createOption({
    key: 'holes' as const,
    prompt: ({ holes }): boolean => {
      return holes === true || holes === 'true' || false;
    },
    validation: z.boolean().optional(),
    option: new Option(
      '-l --holes',
      'Get a list of all the values this template needs',
    ),
  }),
};
