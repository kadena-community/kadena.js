import { Abortable } from 'events';
import { BaseEncodingOptions, Mode, OpenMode, PathLike } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { Stream } from 'stream';

/**
 * Checks if a given path exists.
 *
 * @param {PathLike} path - The path to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the path exists, otherwise false.
 */
export async function isExists(path: PathLike): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Writes data to a file, creating any necessary directories along the path if they don't exist.
 *
 * @param {string} filePath - The path to the file.
 * @param {string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream} data - The data to be written.
 * @param {(BaseEncodingOptions & { mode?: Mode, flag?: OpenMode } & Abortable) | undefined} options - The write options.
 * @returns {Promise<void>} - A promise that resolves once the data has been written to the file.
 */
export async function writeFile(
  filePath: string,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  options?: BaseEncodingOptions & {
    mode?: Mode;
    flag?: OpenMode;
  } & Abortable,
): Promise<void> {
  const dirname = path.dirname(filePath);
  if (!(await isExists(dirname))) {
    await fs.mkdir(dirname, { recursive: true });
  }
  await fs.writeFile(filePath, data, options);
}
