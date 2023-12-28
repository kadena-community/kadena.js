import type { IMostPopularPage } from '@/MostPopularData';
import { getBlogPosts } from '@/utils/getBlogPosts';
import getMostPopularPages from '@/utils/getMostPopularPages';
import type { IMenuData, IMenuItem } from '@kadena/docs-tools';
import { checkSubTreeForActive, getPathName } from '@kadena/docs-tools';

interface IPageConfigProps {
  blogPosts?: string[] | boolean;
  popularPages?: string;
  filename: string;
}

interface IPageConfigReturn {
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

  return {
    leftMenuTree: await checkSubTreeForActive(getPathName(filename)),
    blogPosts: blogData,
    popularPages: popularData,
  };
};
