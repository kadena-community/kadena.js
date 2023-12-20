/**
 * Removes the file extension from a given filename.
 * @param {string} filename - The filename from which the extension is to be removed.
 * @returns {string} The filename without the extension.
 */
export function removeExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

export function removeAfterFirstDot(filename: string): string {
  const dotIndex = filename.indexOf('.');
  return dotIndex === -1 ? filename : filename.substring(0, dotIndex);
}
