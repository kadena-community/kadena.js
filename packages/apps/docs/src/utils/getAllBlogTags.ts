import type { IMenuData, ITag } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';

const PostsPerTag = (tag: string, data?: IMenuData[]): Omit<ITag, 'tag'> => {
  if (!data) return { count: 0, links: [] };

  const links = data.filter((post) => post.tags?.includes(tag));

  return {
    count: links.length,
    links: links.slice(0, 3),
  };
};

export const getAllBlogTags = async (): Promise<ITag[]> => {
  const STARTBRANCH = '/blogchain';
  const data = (await getMenuData()) as unknown as IMenuData[];

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
