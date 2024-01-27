import { input, select } from '@inquirer/prompts';
import type { IUnsignedCommand } from '@kadena/types';
import chalk from 'chalk';
import { z } from 'zod';
import { getTransactions } from '../tx/utils/helpers.js';

import { TRANSACTION_FOLDER_NAME } from '../constants/config.js';

import {
  getAllPlainKeys,
  getAllWalletKeys,
} from '../keys/utils/keysHelpers.js';
import { defaultTemplates } from '../tx/commands/templates/templates.js';
import type { IPrompt } from '../utils/createOption.js';

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

export const transactionSelectPrompt: IPrompt<string> = async (args) => {
  const existingTransactions: string[] = await getTransactions(
    args.signed as boolean,
    args.path as string,
  );

  if (existingTransactions.length === 0) {
    throw new Error('No transactions found. Exiting.');
  }

  const choices = existingTransactions.map((transaction) => ({
    value: transaction,
    name: `Transaction: ${transaction}`,
  }));

  const selectedTransaction = await select({
    message: 'Select a transaction file',
    choices: choices,
  });

  return selectedTransaction;
};

export async function txTransactionDirPrompt(): Promise<string> {
  return await input({
    message: `Enter your transaction directory (default: '${TRANSACTION_FOLDER_NAME}'):`,
    validate: function (input) {
      const validPathRegex = /^$|^\/[A-Za-z0-9._-]+$/;

      if (!validPathRegex.test(input)) {
        return 'Invalid directory format! Please enter a valid directory path starting with "/"';
      }
      return true;
    },
    default: `/${TRANSACTION_FOLDER_NAME}`,
  });
}

export const selectTemplate: IPrompt<string> = async () => {
  const defaultTemplateKeys = Object.keys(defaultTemplates);

  const choices = [
    {
      value: 'filepath',
      name: 'Select file path',
    },
    ...defaultTemplateKeys.map((x) => ({ value: x, name: x })),
  ];

  const result = await select({
    message: 'Which template do you want to use:',
    choices,
  });

  if (result === 'filepath') {
    const result = await input({
      message: 'File path:',
    });
    return result;
  }

  return result;
};

// aliases in templates need to select aliases for keys and/or accounts
// in account, we need to know what value exactly is expected. like public key, account name, or keyset
// the idea is to expect specific naming for the variables, like "account-from" or "pk-from" or "keyset-from"

const getAllAccounts = async (): Promise<string[]> => {
  // Wait for account implementation
  return [];
};

const promptVariableValue = async (key: string): Promise<string> => {
  if (key.startsWith('account-')) {
    // search for account alias
    const accounts = await getAllAccounts();
    const choices = [
      {
        value: '_manual_',
        name: 'Enter account manually',
      },
      ...accounts.map((x) => ({ value: x, name: x })),
    ];
    const value = await select({
      message: `Select account alias for template value ${key}:`,
      choices,
    });

    if (value === '_manual_') {
      return await input({
        message: `Manual entry for account for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });
    }

    return value;
  }
  if (key.startsWith('pk-')) {
    const walletKeys = await getAllWalletKeys();
    const plainKeys = await getAllPlainKeys();

    const choices = [
      {
        value: '_manual_',
        name: 'Enter public key manually',
      },
      ...walletKeys.map((key) => ({
        value: `${key.wallet.wallet}:${key.key}`,
        name: `${key.alias} (wallet ${key.wallet.folder})`,
      })),
      ...plainKeys.map((key) => ({
        value: `plain:${key.key}`,
        name: `${key.alias} (plain key)`,
      })),
    ];
    const value = await select({
      message: `Select public key alias for template value ${key}:`,
      choices,
    });

    if (value === '_manual_') {
      return await input({
        message: `Manual entry for public key for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });
    }
    const selectedKey =
      walletKeys.find((x) => x.key === value) ??
      plainKeys.find((x) => x.key === value);
    if (selectedKey === undefined) throw new Error('public key not found');

    console.log(
      `${chalk.green('>')} Key alias ${selectedKey.alias} using public key ${
        selectedKey.publicKey
      }`,
    );
    return selectedKey.publicKey;
  }
  if (key.startsWith('keyset-')) {
    // search for key alias
    const alias = await input({
      message: `Template value for keyset ${key}:`,
      validate: (value) => {
        if (value === '') return `${key} cannot be empty`;
        return true;
      },
    });
    console.log('keyset alias', alias);
    return alias;
  }

  return await input({
    message: `Template value ${key}:`,
    validate: (value) => {
      if (value === '') return `${key} cannot be empty`;
      return true;
    },
  });
};

export const templateVariables: IPrompt<Record<string, string>> = async (
  args,
) => {
  const values = args.values as string[] | undefined;
  const variables = args.variables as string[] | undefined;

  if (!values || !variables) return {};

  const variableValues = {} as Record<string, string>;

  for (const variable of variables) {
    const match = values.find((value) => value.startsWith(`--${variable}=`));
    if (match !== undefined) variableValues[variable] = match.split('=')[1];
    else {
      variableValues[variable] = await promptVariableValue(variable);
    }
  }

  return variableValues;
};

export const outFilePrompt: IPrompt<string | null> = async (args) => {
  const result = await input({
    message: 'Where do you want to save the output',
  });
  return result ? result : null;
};
