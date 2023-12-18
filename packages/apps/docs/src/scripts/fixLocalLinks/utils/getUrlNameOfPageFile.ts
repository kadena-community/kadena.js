import type { IPage } from '@/scripts/types';

// creates the url from the pagefile and its parentTree
export const getUrlNameOfPageFile = (
  page: IPage,
  parentTree: IPage[],
): string => {
  if (!page) return '';
  return `${
    parentTree.reduce((acc, val) => {
      return `${acc}${val.url}`;
    }, '') + page.url
  }`;
};
