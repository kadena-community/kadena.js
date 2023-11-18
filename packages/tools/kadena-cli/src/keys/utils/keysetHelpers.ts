import type { WriteFileOptions } from 'fs';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { defaultKeysetsPath } from '../../constants/keysets.js';
import { removeFile, writeFile } from '../../utils/filesystem.js';
import { sanitizeFilename } from '../../utils/helpers.js';

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
export function removeKeyset(
  options: Pick<IKeysetCreateOptions, 'name'>,
): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const keysetFilePath = path.join(defaultKeysetsPath, `${sanitizedName}.yaml`);

  removeFile(keysetFilePath);
}

export function writeKeyset(options: IKeysetCreateOptions): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const keysetFilePath = path.join(defaultKeysetsPath, `${sanitizedName}.yaml`);

  writeFile(keysetFilePath, yaml.dump(options), 'utf8' as WriteFileOptions);
}

export function loadKeysetConfig(name: string): IKeysetCreateOptions | never {
  const filePath = path.join(defaultKeysetsPath, `${name}.yaml`);

  if (!existsSync(filePath)) {
    throw new Error('Keyset file not found.');
  }

  return yaml.load(readFileSync(filePath, 'utf8')) as IKeysetCreateOptions;
}
