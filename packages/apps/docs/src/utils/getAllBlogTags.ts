import type { IMenuData, ITag } from '@/types/Layout';
import { getData } from '@/utils/staticGeneration/getData.mjs';

const countPostsPerTag = (tag: string, data?: IMenuData[]): number => {
  if (!data) return 0;

  return data.filter((post) => post.tags?.includes(tag)).length;
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
        count: countPostsPerTag(tag, posts),
      };
    });
};
