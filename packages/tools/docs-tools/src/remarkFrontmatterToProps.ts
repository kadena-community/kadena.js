import { compareDesc } from 'date-fns';
import yaml from 'js-yaml';
import { join } from 'path';
import type {
  DocsRootContent,
  IAuthorInfo,
  IFile,
  IFrontMatterYaml,
  IMenuData,
  INavigation,
  IPropsType,
  ITree,
  Plugin,
} from './types';
import { getReadTime } from './utils/index';
import { getPathName } from './utils/staticGeneration/checkSubTreeForActive';
import { getFlatData } from './utils/staticGeneration/flatPosts';
import { getData } from './utils/staticGeneration/getData';

const getCurrentPostFromJson = async (
  root: string,
): Promise<IMenuData | undefined> => {
  const data = await getFlatData();

  return data.find((item) => {
    return item && (item.root === root || `${item.root}/` === root);
  });
};

const getFrontMatter = (
  node: DocsRootContent,
): IFrontMatterYaml | undefined => {
  const { type } = node;

  if (type === 'yaml') {
    return yaml.load(node.value) as IFrontMatterYaml;
  }
};

const getLatestBlogPostsOfAuthor = async (
  author: IAuthorInfo,
): Promise<IMenuData[]> => {
  const data = await getData();

  const START_BRANCH = '/blogchain';

  const startBranch = data.find((item) => item.root === START_BRANCH);

  const posts =
    startBranch?.children.flatMap((item) => {
      return item.children;
    }) ?? [];

  return posts
    .filter((post) => post.authorId === author.id)
    .sort((a, b) =>
      compareDesc(
        new Date(a.publishDate as unknown as Date),
        new Date(b.publishDate as unknown as Date),
      ),
    )
    .slice(0, 5);
};

const getBlogAuthorInfo = async (
  data: IFrontMatterYaml,
): Promise<IAuthorInfo | undefined> => {
  const authorId = data.authorId;
  if (!authorId) return;

  const authorFilePath = join(process.cwd(), 'src/data/authors.json');

  const authors = await import(authorFilePath);

  const author = (authors as IAuthorInfo[]).find(
    (author) => author.id === authorId,
  );

  if (!author) return;

  author.posts = await getLatestBlogPostsOfAuthor(author);

  return author;
};

const getFileName = (file: IFile): string => {
  if (file.history.length === 0) return '';
  return file.history[0];
};

const getFileNameInPackage = (file: IFile): string => {
  const filename = getFileName(file);
  if (!filename) return '';
  const endPoint = 'packages';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(0, dirArray.indexOf(endPoint) + 1)
    .reverse()
    .join('/');

  return `/${newPath}`;
};

/**
 * create a navigation object with the next and previous link in the navigation json.
 */
const createNavigation = async (file: IFile): Promise<INavigation> => {
  const path = getPathName(getFileName(file));
  const flatData = await getFlatData();

  const itemIdx = flatData.findIndex((i) => {
    return i && (i.root === path || `${i.root}/` === path);
  });

  return {
    previous: flatData[itemIdx - 1] ?? undefined,
    next: flatData[itemIdx + 1] ?? undefined,
  };
};

const remarkFrontmatterToProps = (): Plugin => {
  return async (tree: ITree, file: IFile): Promise<void> => {
    const newChildren = await Promise.all(
      tree.children.map(async (node) => {
        const frontMatterData = getFrontMatter(node);
        if (!frontMatterData) return node;
        const menuData = await getCurrentPostFromJson(
          getPathName(getFileName(file)),
        );

        const navigation = await createNavigation(file);
        const authorInfo = await getBlogAuthorInfo(frontMatterData);

        return {
          type: 'props',
          data: {
            frontmatter: {
              lastModifiedDate: menuData?.lastModifiedDate,
              ...getReadTime(file.value),
              editLink:
                process.env.NEXT_PUBLIC_GIT_EDIT_ROOT +
                getFileNameInPackage(file),
              navigation,
              ...frontMatterData,
              authorInfo,
            },
          },
        } as unknown as IPropsType;
      }),
    );
    // eslint-disable-next-line require-atomic-updates
    tree.children = newChildren;
  };
};

export { remarkFrontmatterToProps as default };
