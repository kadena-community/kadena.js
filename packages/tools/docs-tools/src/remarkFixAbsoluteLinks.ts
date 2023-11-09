import { Definition, Link } from 'mdast';
import { DocsRootContent, ITree, Plugin } from './types';

export const getTypes = <T>(tree: ITree | DocsRootContent, type: string, arr: T[] = []): T[] => {
  if ('children' in tree) {
    tree.children.forEach((branch: DocsRootContent) => {
      if (branch.type === type) {
        arr.push(branch as unknown as T);
      }
      getTypes(branch, type, arr);
    });
  }
  return arr;
};

const remarkFixAbsoluteLinks = (): Plugin => {
  return async (tree): Promise<ITree> => {
    const links= getTypes<Link>(tree, 'link');
    const references = getTypes<Definition>(tree, 'definition');

    var regExp = /^(https?:\/\/docs\.kadena\.io)/;

    [links, references].flat().forEach((link) => {
      if (link.url.match(regExp)) {
        const newLink = link.url.replace(regExp, '') || '/';

        link.url = newLink;
      }
    });

    return tree;
  };
};

export { remarkFixAbsoluteLinks as default };
