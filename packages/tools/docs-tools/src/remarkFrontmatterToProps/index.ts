import type { IFile, IPropsType, ITree, Plugin } from './../types';
import { getReadTime } from './../utils/index';
import { getPathName } from './../utils/staticGeneration/checkSubTreeForActive';
import { createEditLink } from './utils/createEditLink';
import { createNavigation } from './utils/createNavigation';
import { getCurrentPostFromJson } from './utils/getCurrentPostFromJson';
import { getFileName } from './utils/getFileName';
import { getFrontMatter } from './utils/getFrontMatter';

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
              canonicalURL: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${menuData?.root}`,
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
