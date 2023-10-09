/**
 * Convert a Base64Url encoded string to a standard Base64 encoded string.
 * @param {string} str - The Base64Url encoded string.
 * @returns {string} - Returns the standard Base64 encoded representation of the input.
 */
function unescape(str: string): string {
  return (str + '==='.slice((str.length + 3) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
}

/**
 * Convert a standard Base64 encoded string to a Base64Url encoded string.
 * @param {string} str - The Base64 encoded string.
 * @returns {string} - Returns the Base64Url encoded representation of the input.
 */
function escape(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Encode a string to a Base64Url encoded representation.
 * @param {string} str - The input string to be encoded.
 * @param {BufferEncoding} [encoding='utf8'] - The encoding of the input string.
 * @returns {string} - Returns the Base64Url encoded representation of the input.
 */
export function encode(str: string, encoding: BufferEncoding = 'utf8'): string {
  return escape(Buffer.from(str, encoding).toString('base64'));
}

/**
 * Decode a Base64Url encoded string to its original representation.
 * @param {string} str - The Base64Url encoded string to be decoded.
 * @param {BufferEncoding} [encoding='utf8'] - The encoding to use for the output string.
 * @returns {string} - Returns the decoded representation of the Base64Url encoded input.
 */
export function decode(str: string, encoding: BufferEncoding = 'utf8'): string {
  return Buffer.from(unescape(str), 'base64').toString(encoding);
}
