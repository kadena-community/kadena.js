import { input, select } from '@inquirer/prompts';
import type { IUnsignedCommand } from '@kadena/types';
import chalk from 'chalk';
import { z } from 'zod';
import { getAllTransactions } from '../tx/utils/helpers.js';

const CommandPayloadStringifiedJSONSchema = z.string();
const PactTransactionHashSchema = z.string();

const ISignatureJsonSchema = z.object({
  sig: z.string(),
});

export const IUnsignedCommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: z.array(ISignatureJsonSchema.optional()),
});

export async function txUnsignedCommandPrompt(): Promise<IUnsignedCommand> {
  const result = await input({
    message: `Enter your transaction to sign:`,
    validate: (inputString) => {
      try {
        const parsedInput = JSON.parse(inputString);
        IUnsignedCommandSchema.safeParse(parsedInput);
        return true;
      } catch (error) {
        console.log('error', error);
        return 'Incorrect Format. Please enter a valid Unsigned Command.';
      }
    },
  });
  return JSON.parse(result) as IUnsignedCommand;
}

export async function transactionSelectPrompt(): Promise<string> {
  const existingTransactions: string[] = await getAllTransactions();

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
