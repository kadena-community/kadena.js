import type { ITree, Plugin } from './types';

const replaceOrConcatString = (str?: string | null): string => {
  if (!str) str = '';
  const emptyTitleRegex = /title=""/g;
  const emptyTitleReplacement = 'title=" "';

  if (str.match(emptyTitleRegex)) {
    str = str.replace(emptyTitleRegex, emptyTitleReplacement);
  } else if (!str.includes('title="')) {
    str = `${str} ${emptyTitleReplacement}`;
  }

  return str;
};

const remarkCheckForCodeTitle = (): Plugin => {
  return async (tree: ITree): Promise<ITree> => {
    const children = tree.children.map((node) => {
      const { type } = node;

      if (type === 'code') {
        node.meta = replaceOrConcatString(node.meta);
      }

      return node;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkCheckForCodeTitle as default };
