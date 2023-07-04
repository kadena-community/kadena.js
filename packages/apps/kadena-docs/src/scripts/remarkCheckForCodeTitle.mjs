/**
 * This plugin will check that every code block has a title
 * @param {*} tree
 * @returns
 */
const replaceOrConcatString = (str) => {
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
  return async (tree) => {
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
