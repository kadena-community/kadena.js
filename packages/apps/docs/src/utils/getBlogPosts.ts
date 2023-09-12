import { getData } from './staticGeneration/getData.mjs';

import type { IMenuData } from '@/types/Layout';

export const getBlogPosts = async (tags?: string[]): Promise<IMenuData[]> => {
  const menu = getData() as unknown as IMenuData[];
  const blogPosts = menu.find((item) => item.root.includes('/blogchain'));

  if (!blogPosts) return [];

  const flatListWithPosts = blogPosts.children
    .flatMap((year) => year.children)
    .filter((post) => !post.root.includes('/authors'))
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
    .slice(0, 3);

  return flatListWithPosts ?? [];
};
