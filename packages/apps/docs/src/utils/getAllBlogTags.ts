import type { IMenuData } from '@/types/Layout';
import { getData } from '@/utils/staticGeneration/getData.mjs';

export const getAllBlogTags = (): string[] => {
  const STARTBRANCH = '/docs/blogchain';
  const data = getData() as IMenuData[];

  const startBranch = data.find((item) => item.root === STARTBRANCH);

  const posts = startBranch?.children.flatMap((item) => {
    return item.children;
  });

  return [
    ...new Set(posts?.map((post) => post.tags ?? []).flat() ?? []),
  ].sort();
};
