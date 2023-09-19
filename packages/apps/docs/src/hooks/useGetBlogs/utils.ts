import type { IAuthorInfo, IMenuData } from '@/types/Layout';
import { compareDesc } from '@/utils/dates';
import { getAuthorData } from '@/utils/staticGeneration/getData.mjs';

export interface IIBlogLoadOptions {
  authorId?: string;
  year?: string;
  tagId?: string;
}

export const getAuthorInfo = (authorId?: string): IAuthorInfo | undefined => {
  if (!authorId) return;
  return getAuthorData().find((author) => author.id === authorId);
};

export const getInitBlogPosts = (
  menuData: IMenuData[],
  offset: number,
  limit: number,
  { authorId, year, tagId }: IIBlogLoadOptions = {},
): IMenuData[] => {
  const STARTBRANCH = '/docs/blogchain';

  let posts: IMenuData[] = [];
  const startBranch = menuData.find(
    (item) => item.root === STARTBRANCH,
  ) as IMenuData;

  posts = startBranch.children.flatMap((item) => {
    return item.children;
  });

  if (authorId) {
    posts = posts.filter((post) => post.authorId === authorId);
  }
  if (tagId) {
    posts = posts.filter((post) => post.tags?.includes(tagId));
  }

  if (year) {
    posts = posts.filter((post) => {
      if (!post.publishDate) return false;
      const date = new Date(post.publishDate);

      return `${date.getFullYear()}` === year;
    });
  }

  posts = posts
    .sort((a, b) => compareDesc(a.publishDate, b.publishDate))
    .splice(offset, limit);

  return posts.map((post) => {
    return { ...post, authorInfo: getAuthorInfo(post.authorId) };
  });
};
