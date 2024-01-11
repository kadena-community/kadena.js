import type { IConfigTreeItem } from 'src/types';
import { loadConfigPages } from './loadConfigPages';

// return the parents in the config tree of given page.
export const getParentTreeFromPage = async (
  page: IConfigTreeItem,
): Promise<IConfigTreeItem[]> => {
  const pages = await loadConfigPages();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...newPage } = page;

  const innerSearch = (
    targetPage: IConfigTreeItem | undefined,
    innerPages: IConfigTreeItem[],
    parentTree: IConfigTreeItem[],
    parent?: IConfigTreeItem,
  ): IConfigTreeItem[] => {
    return innerPages.reduce((acc, val) => {
      const innerVal = { ...val };
      delete innerVal.children;

      if (JSON.stringify(innerVal) === JSON.stringify(targetPage)) {
        if (parent) delete parent.children;
        return innerSearch(parent, pages, [...acc, innerVal]);
      }

      if (val.children?.length) {
        return innerSearch(targetPage, val.children, [...acc], val);
      }

      return [...acc];
    }, parentTree);
  };

  return innerSearch(newPage, pages, []).reverse().slice(0, -1) ?? [];
};
