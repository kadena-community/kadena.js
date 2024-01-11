import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getFileExtension } from '@kadena/docs-tools';

export const getFileNameOfPageFile = (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
): string => {
  const path = parentTree.reduce((acc, val) => {
    return `${acc}${val.url}`;
  }, '');

  return `${path + page.url}/index.${getFileExtension(page.file)}`;
};
