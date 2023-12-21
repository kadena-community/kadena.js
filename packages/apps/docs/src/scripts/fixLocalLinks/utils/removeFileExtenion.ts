import { getFileExtension } from '@/scripts/movePages/utils/getFileExtension';

export const removeFileExtenion = (filename: string): string => {
  const extension = getFileExtension(filename);

  if (!extension) return filename;

  return filename.replace(`.${extension}`, '');
};
