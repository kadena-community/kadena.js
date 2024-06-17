import type { IFile } from './../../types';

export const getFileName = (file: IFile): string => {
  if (file.history.length === 0) return '';
  return file.history[0];
};
