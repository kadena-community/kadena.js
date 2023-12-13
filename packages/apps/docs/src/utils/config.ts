import type { IMenuItem } from '@/Layout';
import type { IMostPopularPage } from '@/MostPopularData';
import { getBlogPosts } from '@/utils/getBlogPosts';
import getMostPopularPages from '@/utils/getMostPopularPages';
import type { IMenuData } from '@kadena/docs-tools';
import { checkSubTreeForActive, getPathName } from '@kadena/docs-tools';

interface IPageConfigProps {
  blogPosts?: string[] | boolean;
  popularPages?: string;
}

interface IPageConfigReturn {
  leftMenuTree: IMenuItem[];
  blogPosts?: IMenuData[];
  popularPages?: IMostPopularPage[];
}

export const getPageConfig = async ({
  blogPosts,
  popularPages,
}: IPageConfigProps): Promise<IPageConfigReturn> => {
  return {
    leftMenuTree: await checkSubTreeForActive(getPathName(__filename)),
    blogPosts: blogPosts ? await getBlogPosts() : undefined,
    popularPages: popularPages
      ? await getMostPopularPages(popularPages)
      : undefined,
  };
};
