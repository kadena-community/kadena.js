import type { IMenuData } from '@/types/Layout';
import { compareDesc } from '@/utils/dates';

export interface IIBlogLoadOptions {
  authorId?: string;
}

export const getInitBlogPosts = (
  menuData: IMenuData[],
  offset: number,
  limit: number,
  { authorId }: IIBlogLoadOptions = {},
): IMenuData[] => {
  const STARTBRANCH = '/docs/blogchain';

  const startBranch = menuData.find(
    (item) => item.root === STARTBRANCH,
  ) as IMenuData;

  let posts = startBranch.children
    .filter((item) => !item.root.includes('/author'))
    .flatMap((item) => {
      return item.children;
    });

  if (authorId) {
    posts = posts.filter((post) => post.authorId === authorId);
  }

  posts = posts
    .sort((a, b) => compareDesc(a.publishDate, b.publishDate))
    .splice(offset, limit);

  console.log(authorId, posts.length);
  return posts;
};
