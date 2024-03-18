import path from 'path';

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

const isChildPath = (parent: string, child: string): boolean => {
  const relative = path.relative(parent, child);
  return relative
    ? !relative.startsWith('..') && !path.isAbsolute(relative)
    : false;
};

export function relativeToCwd(filepath: string): string {
  const cwd = process.cwd();
  return isChildPath(cwd, filepath)
    ? path.relative(process.cwd(), filepath)
    : filepath;
}
