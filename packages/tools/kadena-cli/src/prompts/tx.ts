import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import {
  getAllPlainKeys,
  getAllWalletKeys,
} from '../keys/utils/keysHelpers.js';
import { defaultTemplates } from '../tx/commands/templates/templates.js';
import type { IPrompt } from '../utils/createOption.js';

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
      return await input({
        message: `Manual entry for account for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });
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
