import { accessSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
/**
 * Checks if a given path exists.
 *
 * @param {PathLike} path - The path to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the path exists, otherwise false.
 */
export function PathExists(path) {
    try {
        accessSync(path);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Checks if a file exists at a given path.
 *
 * @param filePath - The path to the file.
 */
export function ensureFileExists(filePath) {
    return existsSync(filePath);
}
/**
 * Writes data to a file, creating any necessary directories along the path if they don't exist.
 *
 * @param {string} filePath - The path to the file.
 * @param {string | NodeJS.ArrayBufferView} data - The data to be written to the file. Can be a string or a buffer view.
 * @param {string | BaseEncodingOptions | undefined} options - Encoding options or a string specifying the encoding. Can be undefined.
 */
export function writeFile(filePath, data, options) {
    const dirname = path.dirname(filePath);
    if (!PathExists(dirname)) {
        mkdirSync(dirname, { recursive: true });
    }
    writeFileSync(filePath, data, options);
}
/**
 * Ensures that a directory exists, and if it doesn't, creates it.
 *
 * @function
 * @param {string} directoryPath - The path of the directory to ensure it exists.
 * @throws Will throw an error if unable to create the directory.
 * @example
 * // Ensures that the 'myDirectory' exists, if not it will be created.
 * ensureDirectoryExists('path/to/myDirectory');
 */
export function ensureDirectoryExists(directoryPath) {
    if (!PathExists(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
    }
}
