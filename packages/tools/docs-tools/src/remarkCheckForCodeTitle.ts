import type { Root, RootContent } from 'mdast';

interface Tree extends Omit<Root, 'children'> {
  children: RootContent[];
}

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

const remarkCheckForCodeTitle = () => {
  return async (tree: Tree) => {
    const children = tree.children.map((node) => {
      const { type } = node;

      if (type == 'code') {
        node.meta = replaceOrConcatString(node.meta);
      }

      return node;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkCheckForCodeTitle as default };
