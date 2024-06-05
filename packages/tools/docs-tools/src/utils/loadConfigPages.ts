import type { IConfigTreeItem } from './../types';
import { getConfig } from './getConfig';

export const loadConfigPages = async (): Promise<IConfigTreeItem[]> => {
  const { pages } = await getConfig();

  const cleanup = (pages: IConfigTreeItem[]): IConfigTreeItem[] => {
    const innerPages = Object.entries(pages);

    return innerPages.map(([key, page]: [string, IConfigTreeItem]) => {
      if (page.children) page.children = cleanup(page.children);

      return { ...page, id: key } as IConfigTreeItem;
    });
  };

  return cleanup(pages);
};
