/**
 * This plugin will remove the outer Paragraph for a figure tag
 * @param {*} tree
 * @returns
 */

import type { DocsRootContent, ITree, Plugin } from './types';

const remarkFigureOutOfParagraph = (): Plugin => {
  return async (tree): Promise<ITree> => {
    const children = tree.children.map((node: Partial<DocsRootContent>) => {
      const { type } = node;

      if (type === 'paragraph' && node.children) {
        console.log(22, node);
      }

      if (
        type === 'paragraph' &&
        node.children &&
        node.children[0].type === 'image'
      ) {
        const leaf = node.children[0] ?? null;

        const newNode = {
          ...leaf,
          ...node,
          type: 'image',
        };

        delete newNode.children;
        return newNode;
      }

      return node;
    });

    tree.children = children as DocsRootContent[];
    return tree;
  };
};

export { remarkFigureOutOfParagraph as default };
