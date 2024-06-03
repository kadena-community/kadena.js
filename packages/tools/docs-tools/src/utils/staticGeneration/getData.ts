import { readFile } from 'fs/promises';
import { join } from 'path';
import type { IConfigTreeItem, IMenuData } from '../../types';
import { getConfig } from '../getConfig';

const getDataCreator = () => {
  let data: IMenuData[] | undefined;

  return async (): Promise<IMenuData[]> => {
    if (data) return data;

    const menuFilePath = join(process.cwd(), 'src/_generated/menu.json');
    try {
      const fileData = await readFile(menuFilePath, 'utf-8');
      // eslint-disable-next-line require-atomic-updates
      data = JSON.parse(fileData);
      return data as IMenuData[];
    } catch (e) {
      return Promise.reject('Could not load menu data');
    }
  };
};

export const getData = getDataCreator();

export const cleanupPages = (pages: IConfigTreeItem[]): IConfigTreeItem[] => {
  const innerPages = Object.entries(pages);

  return innerPages.map(([key, page]: [string, IConfigTreeItem]) => {
    if (page.children) page.children = cleanupPages(page.children);

    return { ...page, id: key } as IConfigTreeItem;
  });
};

export const getPages = async (): Promise<IConfigTreeItem[]> => {
  const { pages } = await getConfig();

  return cleanupPages(pages);
};
