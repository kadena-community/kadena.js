import type { IAuthorInfo, IMenuData } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';
import authorData from '../../data/authors.json';

export const getAuthorData = (): IAuthorInfo[] => {
  return authorData;
};

interface IPostsPerTag {
  count: number;
  links: IMenuData[];
}

const PostsPerTag = (tag: string, data?: IMenuData[]): IPostsPerTag => {
  if (!data) return { count: 0, links: [] };

  const links = data.filter((post) => post.tags?.includes(tag));

  return {
    count: links.length,
    links: links.slice(0, 3),
  };
};

export interface ITagsData {
  tag: string;
  count: number;
  links: IMenuData[];
}

export const getTagsData = async (): Promise<ITagsData[]> => {
  const START_BRANCH = '/blogchain';
  const data: IMenuData[] = await getMenuData();

  const startBranch = data.find((item) => item.root === START_BRANCH);

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
