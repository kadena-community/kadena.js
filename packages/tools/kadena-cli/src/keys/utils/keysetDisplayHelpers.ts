import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { defaultKeysetsPath } from '../../constants/keysets.js';
import { getExistingKeysets } from '../../utils/helpers.js';

import type {
  ICustomKeysetsChoice,
  IKeysetCreateOptions,
} from './keysetHelpers.js';

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
    if (!existsSync(filePath)) {
      return;
    }

    const keysetConfig = yaml.load(
      readFileSync(filePath, 'utf8'),
    ) as IKeysetCreateOptions;

    displaySeparator();
    log(formatConfig('Name', value));
    log(formatConfig('Predicate', keysetConfig.predicate));
    log(
      formatConfig(
        'Public keys from keypairs',
        keysetConfig.publicKeysFromKeypairs.toString(),
      ),
    );
    log(formatConfig('Other public keys', keysetConfig.publicKeys));
  });

  displaySeparator();
}
