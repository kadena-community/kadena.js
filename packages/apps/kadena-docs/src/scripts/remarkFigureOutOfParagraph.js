/**
 * This plugin will remove the outer Paragraph for a figure tag
 * @param {*} tree
 * @returns
 */

const remarkFigureOutOfParagraph = () => {
  return async (tree) => {
    const children = tree.children.map((branch) => {
      const { type } = branch;

      if (
        type == 'paragraph' &&
        branch.children &&
        branch.children[0].type === 'image'
      ) {
        const leaf = branch.children[0] ?? null;

        const newBranch = {
          ...leaf,
          ...branch,
          type: 'image',
        };
        return newBranch;
      }

      return branch;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkFigureOutOfParagraph as default };
