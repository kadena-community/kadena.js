import { getExistingKeysets, sanitizeFilename } from "../utils/helpers.js";
import { defaultKeysetsPath } from "../constants/keysets.js";
import { removeFile, writeFile } from "../utils/filesystem.js";
import { existsSync, readFileSync, type WriteFileOptions } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import chalk from 'chalk';

export interface ICustomKeysetsChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export interface IKeysetCreateOptions {
  name: string;
  predicate: string;
  publicKeysFromKeypairs: string[];
  publicKeys: string;
}

/**
 * Removes the given keyset from the keysets folder
 *
 * @param {Pick<IKeysetCreateOptions, 'name'>} options - The keyset configuration.
 * @param {string} options.name - The name of the keyset.
 */
export function removeKeyset(options: Pick<IKeysetCreateOptions, 'name'>): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const keysetFilePath = path.join(
    defaultKeysetsPath,
    `${sanitizedName}.yaml`,
  );

  removeFile(keysetFilePath);
}

export function writeKeyset(options: IKeysetCreateOptions): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const keysetFilePath = path.join(
    defaultKeysetsPath,
    `${sanitizedName}.yaml`,
  );

  writeFile(
    keysetFilePath,
    yaml.dump(options),
    'utf8' as WriteFileOptions,
  );
}

export async function displayKeysetsConfig(): Promise<void> {
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


  const existingKeysets: ICustomKeysetsChoice[] = await getExistingKeysets();

  existingKeysets.forEach(({ value }) => {
    const filePath = path.join(defaultKeysetsPath, `${value}.yaml`);
    if (! existsSync) {
      return;
    }

    const keysetConfig = (yaml.load(
        readFileSync(filePath, 'utf8'),
      ) as IKeysetCreateOptions);

    displaySeparator();
    log(formatConfig('Name', value));
    log(formatConfig('Predicate', keysetConfig.predicate));
    log(formatConfig('Public keys from keypairs', keysetConfig.publicKeysFromKeypairs.toString()));
    log(formatConfig('Other public keys', keysetConfig.publicKeys));
  });

  displaySeparator();
};

export function loadKeysetConfig(name: string): IKeysetCreateOptions | never {
  const filePath = path.join(defaultKeysetsPath, `${name}.yaml`);

  if (! existsSync(filePath)) {
    throw new Error('Keyset file not found.')
  }

  return (yaml.load(
    readFileSync(filePath, 'utf8'),
  ) as IKeysetCreateOptions);
};
