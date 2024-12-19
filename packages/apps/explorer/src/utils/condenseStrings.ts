/**
 * Shortens long sections in a string by keeping the first 5 and last 5 characters.
 * @param str  - string to shorten
 * @returns {[string, string]} - shortened string and original string
 */
export function condenseStrings(str: string) {
  // Regex explanation:
  // Split on sequences of characters that are NOT letters, digits, '_' or '-'.
  const parts = str.split(/([^\w\d]+)/u);

  console.log(parts);

  return parts
    .map((part) => {
      if (/^[\w\d]+$/u.test(part) && part.length > 22) {
        return `${part.slice(0, 5)}…${part.slice(-5)}`;
      }
      return part;
    })
    .join('');
}
