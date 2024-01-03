import { loadConfigPages } from '@/scripts/movePages/utils/loadConfigPages';
import type { IConfigTreeItem } from '@kadena/docs-tools';

// return the parents in the config tree of given page.
export const getParentTreeFromPage = async (
  page: IConfigTreeItem,
): Promise<IConfigTreeItem[] | undefined> => {
  const pages = await loadConfigPages();
  delete page.children;

  const innerSearch = (
    targetPage: IConfigTreeItem,
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

  return innerSearch(page, pages, []).reverse().slice(0, -1);
};
