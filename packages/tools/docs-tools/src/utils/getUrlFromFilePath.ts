import { getFileExtension } from './getFileExtension';

export const getUrlFromFilePath = (path: string): string | undefined => {
  const extension = getFileExtension(path);
  const cleanedPath = path
    .replace(`/index.${extension}`, '')
    .split('/apps/docs/src/pages');

  return cleanedPath[1];
};
