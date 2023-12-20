import { getFileExtension } from '@/scripts/movePages/utils/getFileExtension';
import type { IConfigTreeItem } from '@kadena/docs-tools';

export const getFileNameOfPageFile = (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
): string => {
  return `${
    parentTree.reduce((acc, val) => {
      return `${acc}${val.url}`;
    }, '') + page.url
  }/index.${getFileExtension(page.file)}`;
};
