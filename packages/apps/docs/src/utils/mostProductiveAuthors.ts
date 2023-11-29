import type { IAuthorInfo } from '@kadena/docs-tools';
import { add, isAfter } from 'date-fns';
import authors from '../data/authors.json';
import { getLatestBlogPostsOfAuthor } from './getBlogPosts';

const getYearPostCount = async (author: IAuthorInfo): Promise<number> => {
  const lastYear = add(new Date(), { days: -365 });
  const posts = await getLatestBlogPostsOfAuthor(author);

  const thisYearPosts = posts.filter((post) => {
    if (!post.publishDate) return false;
    return isAfter(new Date(post.publishDate), lastYear);
  });

  return thisYearPosts.length;
};

export const mostProductiveAuthors = async (): Promise<IAuthorInfo[]> => {
  const authorsData = await Promise.all(
    authors.map(async (author) => {
      return { ...author, count: await getYearPostCount(author) };
    }),
  );
  return authorsData
    .sort((a, b) => {
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    })
    .slice(0, 5);
};
