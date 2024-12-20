/**
 * Shortens long sections in a string by keeping the first 5 and last 5 characters.
 * @param str  - string to shorten
 * @returns {[string, string]} - shortened string and original string
 */
export function condenseStrings(
  str: string,
  options?: {
    minLength?: number;
    replacement?: string;
    startLength?: number;
    endLength?: number;
  },
): string {
  // set default options and override with provided options
  let config;
  if (options) {
    config = {
      ...{ minLength: 22, replacement: '…', startLength: 5, endLength: 5 },
      ...options,
    };
  } else {
    config = {
      minLength: 22,
      replacement: '…',
      startLength: 5,
      endLength: 5,
    };
  }

  // Regex explanation:
  // Split on sequences of characters that are NOT letters, digits, '_' or '-'.
  const parts = str.split(/([^\w\d]+)/u);

  return parts
    .map((part) => {
      if (/^[\w\d]+$/u.test(part) && part.length > config.minLength) {
        return `${part.slice(0, config.startLength)}${config.replacement}${part.slice(-config.endLength)}`;
      }
      return part;
    })
    .join('');
}
