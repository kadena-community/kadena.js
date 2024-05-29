import type { IMenuData } from '@kadena/docs-tools';
import { formatDate } from './formatDate';

export const getPosts = (root: string, posts: IMenuData[]): string => {
  return posts
    .map(
      (post) => `
      <url>
        <loc>${root}${post.root}</loc>
        ${
          post.lastModifiedDate &&
          `<lastmod>${formatDate(post?.lastModifiedDate)}</lastmod>`
        }
        <changefreq>monthly</changefreq>
        <priority>1</priority>
      </url>`,
    )
    .join('');
};
