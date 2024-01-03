import { getFileExtension } from '@kadena/docs-tools';

export const removeFileExtenion = (filename: string): string => {
  const extension = getFileExtension(filename);

  if (!extension) return filename;

  return filename.replace(`.${extension}`, '');
};
