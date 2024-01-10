import { loadConfigPages } from '@/scripts/movePages/utils/loadConfigPages';
import type { IConfigTreeItem } from '@kadena/docs-tools';

export const getFileFromNameOfUrl = (
  link: string,
): IConfigTreeItem | undefined => {
  const pages = loadConfigPages();
  const [, ...linkArr] = link.split('/');

  const innerFind = (
    pages: IConfigTreeItem[] | undefined,
    parentPage?: IConfigTreeItem,
  ): IConfigTreeItem | undefined => {
    const parentUrl = linkArr.shift();
    if (!parentUrl || !pages) return parentPage;
    const found = pages.find((page) => page.url === `/${parentUrl}`);
    if (!found) return parentPage;
    return innerFind(found.children, found);
  };

  return innerFind(pages);
};
