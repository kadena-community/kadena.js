import { compareDesc } from 'date-fns';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import type {
  DocsRootContent,
  IFile,
  IFrontMatterYaml,
  IMenuData,
  INavigation,
  IPropsType,
  ITree,
  Plugin,
} from './types';
import { getFileFromNameOfUrl } from './utils/getFileFromNameOfUrl';
import { getUrlFromFilePath } from './utils/getUrlFromFilePath';
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

const createEditLink = async (file: IFile): Promise<string> => {
  process.env.NEXT_PUBLIC_GIT_EDIT_ROOT;
  const filePath = getFileNameInPackage(file);

  const pageItem = await getFileFromNameOfUrl(getUrlFromFilePath(filePath));
  if (!pageItem) return '';

  if (pageItem.repo) {
    return `${pageItem.repo}/tree/main${pageItem.file}`;
  }

  return `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/apps/docs/src/docs${pageItem.file}`;
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
        const editLink = await createEditLink(file);
        return {
          type: 'props',
          data: {
            frontmatter: {
              lastModifiedDate: menuData?.lastModifiedDate,
              ...getReadTime(file.value),
              editLink,

              navigation,
              ...frontMatterData,
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
