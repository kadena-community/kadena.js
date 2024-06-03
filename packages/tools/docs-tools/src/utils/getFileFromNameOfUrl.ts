import type { IConfigTreeItem } from './../types';
import { loadConfigPages } from './loadConfigPages';

export const getFileFromNameOfUrl = async (
  link?: string,
): Promise<IConfigTreeItem | undefined> => {
  if (!link) return;
  const pages = await loadConfigPages();
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
