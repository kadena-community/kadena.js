import { cleanPath } from './cleanPath';

export const isIgnoredImage = (
  ignoredAssets: string[],
  path: string,
): boolean => {
  return !!ignoredAssets.find((asset) => {
    return cleanPath(asset) === cleanPath(path);
  });
};
