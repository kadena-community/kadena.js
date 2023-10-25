import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes, } from 'crypto';
/** Constant salt value used for deriving keys */
const SALT = Buffer.from('FkM5B23nB6LVY7mrwDeh');
/**
 * Derive a cryptographic key from the provided password.
 * @param {string} password - User's password.
 * @returns {Buffer} - Returns the derived cryptographic key.
 */
function deriveKey(password) {
    return pbkdf2Sync(password, SALT, 1000, 32, 'sha256');
}
/**
 * Encrypt the provided text using AES-256-GCM algorithm.
 * @param {Buffer} text - Text to encrypt.
 * @param {string} password - User's password.
 * @returns {{ cipherText: Buffer; iv: Buffer; tag: Buffer }} - Returns the encrypted text, initialization vector, and authentication tag.
 */
export function encrypt(text, password) {
    const key = deriveKey(password);
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const cipherText = Buffer.concat([cipher.update(text), cipher.final()]);
    const tag = cipher.getAuthTag(); // Capture the authentication tag
    return {
        cipherText,
        iv,
        tag,
    };
}
/**
 * Decrypt the provided encrypted text using AES-256-GCM algorithm.
 * @param {Encrypted} encrypted - Encrypted text, initialization vector, and authentication tag.
 * @param {string} password - User's password.
 * @returns {Buffer | undefined} - Returns the decrypted text or undefined if decryption fails.
 */
export function decrypt(encrypted, password) {
    const key = deriveKey(password);
    const decipher = createDecipheriv('aes-256-gcm', key, encrypted.iv);
    decipher.setAuthTag(encrypted.tag); // Set the authentication tag
    try {
        return Buffer.concat([
            decipher.update(encrypted.cipherText),
            decipher.final(),
        ]);
    }
    catch (err) {
        console.warn('Failed to decrypt seed');
        return undefined;
    }
}
/**
 * Convert a Buffer to a Base64 encoded string.
 * @param {Buffer} buffer - Buffer to convert.
 * @returns {string} - Returns the Base64 encoded string.
 */
export function bufferToBase64(buffer) {
    return buffer.toString('base64');
}
/**
 * Convert a Base64 encoded string to a Buffer.
 * @param {string} base64 - Base64 encoded string to convert.
 * @returns {Buffer} - Returns the resulting Buffer.
 */
export function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}
