import chalk from 'chalk';
import type { WriteFileOptions } from 'fs';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { defaultKeypairsPath } from '../constants/keypairs.js';
import { removeFile, writeFile } from '../utils/filesystem.js';
import { getExistingKeypairs, sanitizeFilename } from '../utils/helpers.js';

export interface ICustomKeypairsChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export interface IKeypairCreateOptions {
  name: string;
  publicKey: string;
  secretKey: string;
}

/**
 * Removes the given keypair from the keypairs folder
 *
 * @param {Pick<IKeypairCreateOptions, 'name'>} options - The keypair configuration.
 * @param {string} options.name - The name of the keypair.
 */
export function removeKeypair(
  options: Pick<IKeypairCreateOptions, 'name'>,
): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const keypairFilePath = path.join(
    defaultKeypairsPath,
    `${sanitizedName}.yaml`,
  );

  removeFile(keypairFilePath);
}

export function writeKeypair(options: IKeypairCreateOptions): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const keypairFilePath = path.join(
    defaultKeypairsPath,
    `${sanitizedName}.yaml`,
  );

  writeFile(keypairFilePath, yaml.dump(options), 'utf8' as WriteFileOptions);
}

export function displayKeypairsConfig(): void {
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

  const existingKeypairs: ICustomKeypairsChoice[] = getExistingKeypairs();

  existingKeypairs.forEach(({ value }) => {
    const filePath = path.join(defaultKeypairsPath, `${value}.yaml`);
    if (!existsSync(filePath)) {
      return;
    }

    const keypairConfig = yaml.load(
      readFileSync(filePath, 'utf8'),
    ) as IKeypairCreateOptions;

    displaySeparator();
    log(formatConfig('Name', value));
    log(formatConfig('Public key', keypairConfig.publicKey));
    log(formatConfig('Secret key', keypairConfig.secretKey));
  });

  displaySeparator();
}

export function loadKeypairConfig(name: string): IKeypairCreateOptions | never {
  const filePath = path.join(defaultKeypairsPath, `${name}.yaml`);

  if (!existsSync(filePath)) {
    throw new Error('Keypair file not found.');
  }

  return yaml.load(readFileSync(filePath, 'utf8')) as IKeypairCreateOptions;
}
