import { type IMenuData } from '@/types/Layout';
import { compareDesc } from '@/utils/dates';

export const getInitBlogPosts = (
  menuData: IMenuData[],
  offset: number,
  limit: number,
): IMenuData[] => {
  const STARTBRANCH = '/docs/blogchain';

  const startBranch = menuData.find(
    (item) => item.root === STARTBRANCH,
  ) as IMenuData;

  return startBranch.children
    .flatMap((item) => {
      return item.children;
    })
    .sort((a, b) => compareDesc(a.publishDate, b.publishDate))
    .splice(offset, limit);
};
