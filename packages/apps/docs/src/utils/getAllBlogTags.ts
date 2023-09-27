import type { IMenuData, ITag } from '@/types/Layout';
import { getData } from '@/utils/staticGeneration/getData.mjs';

const PostsPerTag = (tag: string, data?: IMenuData[]): Omit<ITag, 'tag'> => {
  if (!data) return { count: 0, links: [] };

  const links = data.filter((post) => post.tags?.includes(tag));

  return {
    count: links.length,
    links: links.slice(0, 3),
  };
};

export const getAllBlogTags = (): ITag[] => {
  const STARTBRANCH = '/docs/blogchain';
  const data = getData() as IMenuData[];

  const startBranch = data.find((item) => item.root === STARTBRANCH);

  const posts = startBranch?.children.flatMap((item) => {
    return item.children;
  });

  return [...new Set(posts?.map((post) => post.tags ?? []).flat() ?? [])]
    .sort()
    .map((tag) => {
      return {
        tag,
        ...PostsPerTag(tag, posts),
      };
    });
};
