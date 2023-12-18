import { loadConfigPages } from '@/scripts/movePages/utils/loadConfigPages';
import type { IPage } from '@/scripts/types';

export const getFileFromNameOfUrl = (link: string): IPage | undefined => {
  const pages = loadConfigPages();
  const [, ...linkArr] = link.split('/');

  const innerFind = (
    pages: IPage[] | undefined,
    parentPage?: IPage,
  ): IPage | undefined => {
    const parentUrl = linkArr.shift();
    if (!parentUrl || !pages) return parentPage;
    const found = pages.find((page) => page.url === `/${parentUrl}`);
    if (!found) return parentPage;
    return innerFind(found.children, found);
  };

  return innerFind(pages);
};
