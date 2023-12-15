import type { IMostPopularPage } from '@/MostPopularData';
import { getBlogPosts } from '@/utils/getBlogPosts';
import getMostPopularPages from '@/utils/getMostPopularPages';
import type { IMenuData, IMenuItem } from '@kadena/docs-tools';
import {
  checkSubTreeForActive,
  flattenData,
  getHeaderItems,
  getMenuData,
  getPathName,
} from '@kadena/docs-tools';

export const getAllPages = async (): Promise<IMenuItem[]> => {
  const data = await getMenuData();
  const allPosts = flattenData(data) as IMenuItem[];

  return allPosts;
};

interface IPageConfigProps {
  blogPosts?: string[] | boolean;
  popularPages?: string;
  filename: string;
}

interface IPageConfigReturn {
  headerItems: IMenuItem[];
  leftMenuTree: IMenuItem[];
  blogPosts: IMenuData[] | null;
  popularPages: IMostPopularPage[] | null;
}

export const getPageConfig = async ({
  blogPosts,
  popularPages,
  filename,
}: IPageConfigProps): Promise<IPageConfigReturn> => {
  const blogData = Array.isArray(blogPosts)
    ? await getBlogPosts(blogPosts)
    : blogPosts
    ? await getBlogPosts()
    : null;
  const popularData = popularPages
    ? await getMostPopularPages(popularPages)
    : null;

  const headerItems = await getHeaderItems();

  return {
    headerItems,
    leftMenuTree: await checkSubTreeForActive(getPathName(filename)),
    blogPosts: blogData,
    popularPages: popularData,
  };
};
