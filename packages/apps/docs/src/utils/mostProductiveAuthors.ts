import authors from '../data/authors.json';

import { getLatestBlogPostsOfAuthor } from './getBlogPosts';

import type { IAuthorInfo } from '@/Layout';
import { add, isAfter } from 'date-fns';

const getYearPostCount = (author: IAuthorInfo): number => {
  const lastYear = add(new Date(), { days: -365 });
  const posts = getLatestBlogPostsOfAuthor(author);

  const thisYearPosts = posts.filter((post) => {
    if (!post.publishDate) return false;
    return isAfter(new Date(post.publishDate), lastYear);
  });

  return thisYearPosts.length;
};

export const mostProductiveAuthors = (): IAuthorInfo[] => {
  return authors
    .map((author) => {
      return { ...author, count: getYearPostCount(author) };
    })
    .sort((a, b) => {
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    })
    .slice(0, 5);
};
