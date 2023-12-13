import type { IMenuItem } from '@/Layout';
import type { IMostPopularPage } from '@/MostPopularData';
import { getBlogPosts } from '@/utils/getBlogPosts';
import getMostPopularPages from '@/utils/getMostPopularPages';
import { flattenData } from '@/utils/staticGeneration/flatPosts.mjs';
import type { IMenuData } from '@kadena/docs-tools';
import {
  checkSubTreeForActive,
  getMenuData,
  getPathName,
} from '@kadena/docs-tools';
import yaml from './../config.yaml';

export const getHeaderItems = async (): Promise<IMenuItem[]> => {
  const data = await getMenuData();
  const { menu } = yaml;

  return menu.map((item: string) => {
    const found = data.find((d) => d.root === `/${item}`);
    if (!found) return null;
    return found;
  });
};

export const getAllPages = async (): Promise<IMenuItem[]> => {
  const data = await getMenuData();
  const allPosts = flattenData(data) as IMenuItem[];

  return allPosts;
};

interface IPageConfigProps {
  blogPosts?: boolean;
  popularPages?: string;
}

interface IPageConfigReturn {
  headerItems: IMenuItem[];
  leftMenuTree: IMenuItem[];
  blogPosts?: IMenuData[];
  popularPages?: IMostPopularPage[];
}

export const getPageConfig = async ({
  blogPosts,
  popularPages,
}: IPageConfigProps): Promise<IPageConfigReturn> => {
  return {
    headerItems: await getHeaderItems(),
    leftMenuTree: await checkSubTreeForActive(getPathName(__filename)),
    blogPosts: blogPosts ? await getBlogPosts() : undefined,
    popularPages: popularPages
      ? await getMostPopularPages(popularPages)
      : undefined,
  };
};
