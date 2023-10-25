import { HDKEY_ENC_EXT, HDKEY_EXT, KEY_DIR, PLAINKEY_EXT, } from '../../constants/config.js';
import { ensureDirectoryExists } from '../../utils/filesystem.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
/**
 * Saves the given key pair to multiple files based on the provided amount.
 * Only subsequent files will be postfixed with an index if the amount is greater than 1.
 *
 * @param {string} alias - The base alias for the key pair.
 * @param {string} publicKey - The public key.
 * @param {string} privateKey - The private key.
 * @param {number} [amount=1] - The number of files to write.
 */
export function savePlainKeyByAlias(alias, publicKey, privateKey, amount = 1) {
    ensureDirectoryExists(KEY_DIR);
    const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();
    for (let i = 0; i < amount; i++) {
        let fileName = sanitizedAlias;
        // Append index to the filename if it's not the first file.
        if (i > 0) {
            fileName += `-${i}`;
        }
        fileName += PLAINKEY_EXT;
        const filePath = join(KEY_DIR, fileName);
        const data = {
            publicKey,
            privateKey,
        };
        writeFileSync(filePath, JSON.stringify(data));
    }
}
/**
 * Retrieves a key pair based on the given alias.
 *
 * @param {string} alias - The alias corresponding to the key file to be fetched.
 * @returns {{publicKey: string; secretKey: string} | undefined} The key pair if found, otherwise undefined.
 */
export function getStoredPlainKeyByAlias(alias) {
    const filePath = join(KEY_DIR, `${alias}${PLAINKEY_EXT}`);
    if (existsSync(filePath)) {
        const data = readFileSync(filePath, 'utf-8');
        const keyPair = JSON.parse(data);
        return {
            publicKey: keyPair.publicKey,
            secretKey: keyPair.privateKey,
        };
    }
    return undefined;
}
/**
 * Loads the public keys from key files based on their aliases.
 * Iterates through files in the key directory, and if a file matches the '.key' extension,
 * its content is parsed, and if it contains a valid public key, it's added to the returned array.
 *
 * @returns {string[]} Array of public keys.
 */
export function loadAllKeysFromAliasFiles() {
    ensureDirectoryExists(KEY_DIR);
    const publicKeys = [];
    const files = readdirSync(KEY_DIR);
    for (const file of files) {
        if (file.endsWith('.key')) {
            const filePath = join(KEY_DIR, file);
            const data = readFileSync(filePath, 'utf-8');
            const keyPair = JSON.parse(data);
            if (keyPair !== undefined &&
                typeof keyPair.publicKey === 'string' &&
                keyPair.publicKey.length > 0) {
                publicKeys.push(keyPair.publicKey);
            }
        }
    }
    return publicKeys;
}
/**
 * Stores the mnemonic phrase or seed to the filesystem.
 *
 * @param {string} words - The mnemonic phrase.
 * @param {string} seed - The seed.
 * @param {string} fileName - The name of the file to store the mnemonic or seed in.
 * @param {boolean} hasPassword - Whether a password was used to generate the seed.
 */
export function storeHdKey(words, seed, fileName, hasPassword) {
    ensureDirectoryExists(KEY_DIR);
    const sanitizedFilename = sanitizeFilename(fileName).toLowerCase();
    const fileExtension = hasPassword ? HDKEY_ENC_EXT : HDKEY_EXT;
    const dataToStore = hasPassword ? seed : words;
    const storagePath = join(KEY_DIR, `${sanitizedFilename}${fileExtension}`);
    writeFileSync(storagePath, dataToStore, 'utf8');
}
/**
 * Retrieves the stored mnemonic phrase from the filesystem.
 *
 * @param {string} fileName - The name of the file where the mnemonic is stored.
 * @returns {string | undefined} The stored mnemonic phrase, or undefined if not found.
 */
export function getStoredHdKey(fileName) {
    const storagePath = join(KEY_DIR, fileName);
    if (existsSync(storagePath)) {
        return readFileSync(storagePath, 'utf8');
    }
    return undefined;
}
