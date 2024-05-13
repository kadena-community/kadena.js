import type { IMostPopularPage } from '@/MostPopularData';
import getMostPopularPages from '@/utils/getMostPopularPages';
import type { IMenuItem } from '@kadena/docs-tools';
import {
  checkSubTreeForActive,
  flattenData,
  getHeaderMenuItems,
  getMenuData,
  getPathName,
} from '@kadena/docs-tools';

export const getAllPages = async (): Promise<IMenuItem[]> => {
  const data = await getMenuData();
  const allPosts = flattenData(data) as IMenuItem[];

  return allPosts;
};

interface IPageConfigProps {
  popularPages?: string;
  filename: string;
}

interface IPageConfigReturn {
  headerMenuItems: IMenuItem[];
  leftMenuTree: IMenuItem[];
  popularPages: IMostPopularPage[] | null;
}

export const getPageConfig = async ({
  popularPages,
  filename,
}: IPageConfigProps): Promise<IPageConfigReturn> => {
  const popularData = popularPages
    ? await getMostPopularPages(popularPages)
    : null;

  const headerMenuItems = await getHeaderMenuItems();

  return {
    headerMenuItems,
    leftMenuTree: await checkSubTreeForActive(getPathName(filename)),
    popularPages: popularData,
  };
};
