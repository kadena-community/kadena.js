import type { IAuthorInfo, IMenuData } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';
import { compareDesc } from './dates';

export const getBlogPosts = async (tags?: string[]): Promise<IMenuData[]> => {
  const menu: IMenuData[] = await getMenuData();
  const blogPosts = menu.find((item) => item.root.includes('/blogchain'));

  if (!blogPosts) return [];

  const flatListWithPosts = blogPosts.children
    .flatMap((year) => year.children)
    .filter((post) => {
      if (!tags) return post;
      return post.tags?.some((r) => tags.includes(r));
    })
    .sort((a, b) => {
      if (!a.publishDate || !b.publishDate) return 0;
      if (a.publishDate > b.publishDate) return -1;
      if (a.publishDate < b.publishDate) return 1;
      return 0;
    })
    .slice(0, 4);

  return flatListWithPosts ?? [];
};

export const getLatestBlogPostsOfAuthor = async (
  author: IAuthorInfo,
): Promise<IMenuData[]> => {
  const data: IMenuData[] = await getMenuData();
  const STARTBRANCH = '/blogchain';

  const startBranch = data.find((item) => item.root === STARTBRANCH);

  const posts =
    startBranch?.children.flatMap((item) => {
      return item.children;
    }) ?? [];

  return posts
    .filter((post) => post.authorId === author.id)
    .sort((a, b) => compareDesc(a.publishDate, b.publishDate))
    .slice(0, 5);
};
