import { getFileExtension } from '@/scripts/movePages/utils/getFileExtension';
import type { IPage } from '@/scripts/types';

export const getFileNameOfPageFile = (
  page: IPage,
  parentTree: IPage[],
): string => {
  return `${
    parentTree.reduce((acc, val) => {
      return `${acc}${val.url}`;
    }, '') + page.url
  }/index.${getFileExtension(page.file)}`;
};
