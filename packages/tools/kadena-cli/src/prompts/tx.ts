import type { IUnsignedCommand } from '@kadena/types';
import chalk from 'chalk';
import { z } from 'zod';

import { TRANSACTION_FOLDER_NAME } from '../constants/config.js';
import { getTransactions } from '../tx/utils/txHelpers.js';

import {
  getAllPlainKeys,
  getAllWalletKeys,
} from '../keys/utils/keysHelpers.js';
import { services } from '../services/index.js';
import { getTemplates } from '../tx/commands/templates/templates.js';
import type { IPrompt } from '../utils/createOption.js';
import { checkbox, input, select } from '../utils/prompts.js';

const CommandPayloadStringifiedJSONSchema = z.string();
const PactTransactionHashSchema = z.string();

const ISignatureJsonSchema = z.object({
  sig: z.string(),
});

const SignatureOrUndefinedOrNull = z.union([
  ISignatureJsonSchema,
  z.undefined(),
  z.null(),
]);

export const ICommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: z.array(ISignatureJsonSchema),
});

export const IUnsignedCommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: z.array(SignatureOrUndefinedOrNull),
});

// export const ISignatureJsonSchema = z.union([
//   z.object({
//     sig: z.string(),
//   }),
//   z.null(),
// ]);

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
  const signed = (args.signed as boolean) ?? false;
  const path = (args.path as string) ?? (args.txTransactionDir as string);
  const existingTransactions: string[] = await getTransactions(signed, path);

  if (existingTransactions.length === 0) {
    throw new Error('No transactions found.');
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

export const transactionsSelectPrompt: IPrompt<string[]> = async (args) => {
  const signed = (args.signed as boolean) ?? true;
  const path =
    (args.path as string) ?? (args.directory as string) ?? process.cwd();

  const fileExists = await services.filesystem.fileExists(path);
  if (fileExists) return [path];

  const existingTransactions: string[] = await getTransactions(signed, path);

  if (existingTransactions.length === 0) {
    throw new Error('No transactions found.');
  }

  const choices = existingTransactions.map((transaction) => ({
    value: transaction,
    name: `Transaction: ${transaction}`,
  }));

  const selectedTransaction = await checkbox({
    message: 'Select a transaction file',
    choices: choices,
    pageSize: 10,
    required: true,
  });

  return selectedTransaction;
};

export async function txDirPrompt(): Promise<string> {
  return await input({
    message: `Enter your directory (default: working directory):`,
    validate: async (input) => {
      const dirExists = await services.filesystem.directoryExists(input);
      if (!dirExists) {
        return 'Directory or file not found. Please enter a valid directory or file path.';
      }
      return true;
    },
    default: `./`,
  });
}

export async function txTransactionDirPrompt(): Promise<string> {
  return await input({
    message: `Enter your transaction directory (default: './${TRANSACTION_FOLDER_NAME}'):`,
    validate: async (input) => {
      const dirExists = await services.filesystem.directoryExists(input);
      if (!dirExists) {
        return 'Directory or file not found. Please enter a valid directory or file path.';
      }
      return true;
    },
    default: `./${TRANSACTION_FOLDER_NAME}`,
  });
}

export const selectTemplate: IPrompt<string> = async (args) => {
  const stdin = args.stdin as string | undefined;
  if (stdin && stdin !== '') return '-';
  const templates = await getTemplates();
  const defaultTemplateKeys = Object.keys(templates);

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
    // search for account alias - needs account implementation
    const accounts = await getAllAccounts();

    const hasAccount = accounts.length > 0;
    let value: string | null = null;

    const choices = [
      {
        value: '_manual_',
        name: 'Enter account manually',
      },
      ...accounts.map((x) => ({ value: x, name: x })),
    ];
    if (hasAccount) {
      value = await select({
        message: `Select account alias for template value ${key}:`,
        choices,
      });
    }

    if (value === '_manual_' || !hasAccount) {
      const inputValue = await input({
        message: `Manual entry for account for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });

      return inputValue;
    }

    if (value === null) throw new Error('account not found');
    return value;
  }
  if (key.startsWith('pk-')) {
    const walletKeys = await getAllWalletKeys();
    const plainKeys = await getAllPlainKeys();

    const hasKeys = walletKeys.length > 0 || plainKeys.length > 0;
    let value: string | null = null;

    const choices = [
      {
        value: '_manual_',
        name: 'Enter public key manually',
      },
      ...walletKeys.map((key) => ({
        value: key.publicKey,
        name: `${key.alias} (wallet ${key.wallet.folder})`,
      })),
      ...plainKeys.map((key) => ({
        value: key.publicKey,
        name: `${key.alias} (plain key)`,
      })),
    ];

    if (hasKeys) {
      value = await select({
        message: `Select public key alias for template value ${key}:`,
        choices,
      });
    }

    if (value === '_manual_' || !hasKeys) {
      return await input({
        message: `Manual entry for public key for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });
    }

    const selectedKey =
      walletKeys.find((x) => x.publicKey === value) ??
      plainKeys.find((x) => x.publicKey === value);
    if (selectedKey === undefined) throw new Error('public key not found');

    if (value === null || value === '_manual_') {
      throw new Error('public key not found');
    }

    console.log(`${chalk.green('>')} Using public key ${value}`);
    return value;
  }
  if (key.startsWith('keyset-')) {
    // search for key alias - needs account implementation
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
  const data = args.data as Record<string, string | number>;

  if (!values || !variables) return {};

  const variableValues = {} as Record<string, string>;

  for (const variable of variables) {
    // Prioritize variables from data file
    if (Object.hasOwn(data, variable)) {
      variableValues[variable] = String(data[variable]);
      continue;
    }
    // Find variables in cli arguments
    const match = values.find((value) => value.startsWith(`--${variable}=`));
    if (match !== undefined) variableValues[variable] = match.split('=')[1];
    else {
      // Prompt for variable value
      variableValues[variable] = await promptVariableValue(variable);
    }
  }

  return variableValues;
};

export const outFilePrompt: IPrompt<string | null> = async (args) => {
  const result = await input({
    message: 'Where do you want to save the output:',
  });
  return result ?? null;
};

export const templateDataPrompt: IPrompt<string | null> = async (args) => {
  const result = await input({
    message: 'File path of data to use for template (json or yaml):',
  });
  return result ?? null;
};
