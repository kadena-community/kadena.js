import { getExistingAccounts, sanitizeFilename } from "../utils/helpers.js";
import { defaultAccountsPath, accountDefaults } from "../constants/accounts.js";
import { removeFile, writeFile } from "../utils/filesystem.js";
import { existsSync, readFileSync, type WriteFileOptions } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import chalk from 'chalk';
import { ChainId } from "@kadena/types";

export interface ICustomAccountsChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export interface IAccountCreateOptions {
  name: string;
  account: string;
  keyset: string;
  network: string;
  chainId: ChainId;
}

/**
 * Removes the given account from the accounts folder
 *
 * @param {Pick<IAccountCreateOptions, 'name'>} options - The account configuration.
 * @param {string} options.name - The name of the account.
 */
export function removeAccount(options: Pick<IAccountCreateOptions, 'name'>): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const accountFilePath = path.join(
    defaultAccountsPath,
    `${sanitizedName}.yaml`,
  );

  removeFile(accountFilePath);
}

export function writeAccount(options: IAccountCreateOptions): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const accountFilePath = path.join(
    defaultAccountsPath,
    `${sanitizedName}.yaml`,
  );

  writeFile(
    accountFilePath,
    yaml.dump(options),
    'utf8' as WriteFileOptions,
  );
}

export async function displayAccountsConfig(): Promise<void> {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const formatConfig = (
    key: string,
    value?: string,
    isDefault?: boolean,
  ): string => {
    const valueDisplay =
      (value?.trim() ?? '') !== '' ? chalk.green(value!) : chalk.red('Not Set');

    const defaultIndicator =
      isDefault === true ? chalk.yellow(' (Using defaults)') : '';
    const keyValue = `${key}: ${valueDisplay}${defaultIndicator}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };


  const existingAccounts: ICustomAccountsChoice[] = await getExistingAccounts();

  existingAccounts.forEach(({ value }) => {
    const filePath = path.join(defaultAccountsPath, `${value}.yaml`);
    if (! existsSync) {
      return;
    }

    const accountConfig = (yaml.load(
        readFileSync(filePath, 'utf8'),
      ) as IAccountCreateOptions);

    displaySeparator();
    log(formatConfig('Name', value));
    log(formatConfig('Account', accountConfig.account));
    log(formatConfig('Keyset', accountConfig.keyset));
    log(formatConfig('Network', accountConfig.network));
    log(formatConfig('Chain ID', accountConfig.chainId.toString()));
  });

  displaySeparator();
};

export function loadAccountConfig(name: string): IAccountCreateOptions | never {
  const filePath = path.join(defaultAccountsPath, `${name}.yaml`);

  if (! existsSync(filePath)) {
    throw new Error('Account file not found.')
  }

  return (yaml.load(
    readFileSync(filePath, 'utf8'),
  ) as IAccountCreateOptions);
};
