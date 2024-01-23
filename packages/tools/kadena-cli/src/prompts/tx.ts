import { input, select } from '@inquirer/prompts';
import type { IUnsignedCommand } from '@kadena/types';
import chalk from 'chalk';
import { z } from 'zod';
import { getTransactions } from '../tx/utils/helpers.js';
import { isAlphanumeric } from '../utils/helpers.js';

const CommandPayloadStringifiedJSONSchema = z.string();
const PactTransactionHashSchema = z.string();

const ISignatureJsonSchema = z.union([
  z.object({
    sig: z.union([z.string(), z.null()]),
  }),
  z.null(),
]);

export const IUnsignedCommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: z.array(ISignatureJsonSchema).optional(),
});

export const ICommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: z.array(ISignatureJsonSchema),
});

export async function txUnsignedCommandPrompt(): Promise<IUnsignedCommand> {
  const result = await input({
    message: `Enter your transaction to sign:`,
    validate: (inputString) => {
      try {
        const parsedInput = JSON.parse(inputString);
        IUnsignedCommandSchema.parse(parsedInput);
        return true;
      } catch (error) {
        console.log('error', error);
        return 'Incorrect Format. Please enter a valid Unsigned Command.';
      }
    },
  });
  return JSON.parse(result) as IUnsignedCommand;
}

export async function transactionSelectPrompt(
  signed: boolean,
): Promise<string> {
  const existingTransactions: string[] = await getTransactions(signed);

  if (existingTransactions.length === 0) {
    console.log(chalk.red('No transactions found. Exiting.'));
    process.exit(0);
  }

  const choices = existingTransactions.map((transaction) => ({
    value: transaction,
    name: `Transaction: ${transaction}`,
  }));

  const selectedTransaction = await select({
    message: 'Select a transaction',
    choices: choices,
  });

  return selectedTransaction;
}

export async function txTransactionDirPrompt(): Promise<string> {
  return await input({
    message: `Enter your transaction directory (default: './transactions'):`,
    validate: function (input) {
      if (!isAlphanumeric(input)) {
        return 'Directories must be alphanumeric! Please enter a directory name.';
      }
      return true;
    },
  });
}
