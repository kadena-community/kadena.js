/**
 * This plugin will remove the outer Paragraph for a figure tag
 * @param {*} tree
 * @returns
 */

const remarkFigureOutOfParagraph = () => {
  return async (tree) => {
    const children = tree.children.map((node) => {
      const { type } = node;

      if (
        type == 'paragraph' &&
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

        console.log(newNode);
        return newNode;
      }

      return node;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkFigureOutOfParagraph as default };
