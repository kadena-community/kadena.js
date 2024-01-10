import type { IConfigTreeItem } from 'src/types';

// creates the url from the pagefile and its parentTree
export const getUrlNameOfPageFile = (
  page: IConfigTreeItem | undefined,
  parentTree: IConfigTreeItem[],
): string => {
  if (!page) return '';
  return `${
    parentTree.reduce((acc, val) => {
      return `${acc}${val.url}`;
    }, '') + page.url
  }`;
};
