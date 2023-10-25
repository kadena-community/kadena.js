import { HDKEY_EXT, KEY_DIR, PLAINKEY_EXT } from '../../constants/config.js';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
/**
 * Fetches all plain key files from the specified directory.
 * @returns {string[]} Array of plain key filenames without their extensions.
 */
export function getPlainKeys() {
    return getFilesWithExtension(KEY_DIR, PLAINKEY_EXT);
}
/**
 * Fetches all encrypted HD key files from the specified directory.
 * @returns {string[]} Array of encrypted HD key filenames without their extensions.
 */
export function getEncryptedHDKeys() {
    return getFilesWithExtension(KEY_DIR, HDKEY_EXT);
}
/**
 * Fetches all unencrypted HD key files from the specified directory.
 * @returns {string[]} Array of unencrypted HD key filenames without their extensions.
 */
export function getUnencryptedHDKeys() {
    return getFilesWithExtension(KEY_DIR, HDKEY_EXT);
}
/**
 * Fetches all files with a specific extension from a given directory.
 * @param {string} dir - The directory path from which files are to be read.
 * @param {string} extension - The file extension to filter by.
 * @returns {string[]} Array of filenames with the specified extension, without the extension itself.
 */
export function getFilesWithExtension(dir, extension) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    try {
        return readdirSync(dir)
            .filter((filename) => filename.toLowerCase().endsWith(extension))
            .map((filename) => path.basename(filename.toLowerCase(), extension));
    }
    catch (error) {
        console.error(`Error reading directory for extension ${extension}:`, error);
        return [];
    }
}
