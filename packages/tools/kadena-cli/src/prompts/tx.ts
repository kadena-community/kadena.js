import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { IWalletKey } from '../keys/utils/keysHelpers.js';
import {
  getAllWallets,
  getWallet,
  getWalletKey,
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

const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue =>
  value !== null && value !== undefined;

const getAllPublicKeys = async (): Promise<IWalletKey[]> => {
  // Wait for account implementation
  const walletNames = await getAllWallets();
  const wallets = await Promise.all(
    walletNames.map((wallet) => getWallet(wallet)),
  );
  const keys = await Promise.all(
    wallets
      .filter(notEmpty)
      .map((wallet) =>
        Promise.all(wallet.keys.map((key) => getWalletKey(wallet, key))),
      ),
  );
  return keys.flat();
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
    const keys = await getAllPublicKeys();

    const choices = [
      {
        value: '_manual_',
        name: 'Enter public key manually',
      },
      ...keys.map((key) => ({
        value: key.key, // TODO: add wallet to key to prevent duplicate errors
        name: `${key.alias} (wallet ${key.wallet.folder})`,
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
    const walletKey = keys.find((x) => x.key === value);
    if (walletKey === undefined) throw new Error('public key not found');

    console.log(
      `${chalk.green('>')} Key alias ${walletKey.alias} using public key ${
        walletKey.publicKey
      }`,
    );
    return walletKey.publicKey;
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
