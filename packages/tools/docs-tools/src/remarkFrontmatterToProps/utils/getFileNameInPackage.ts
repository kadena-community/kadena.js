import type { IFile } from './../../types';
import { getFileName } from './getFileName';

export const getFileNameInPackage = (file: IFile): string => {
  const filename = getFileName(file);

  if (!filename) return '';
  const endPoint = 'packages';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(0, dirArray.indexOf(endPoint) + 1)
    .reverse()
    .join('/');

  return `/${newPath}`;
};
