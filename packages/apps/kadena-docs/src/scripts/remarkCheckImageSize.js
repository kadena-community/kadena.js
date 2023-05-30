import sizeOf from 'image-size';
/**
 * This plugin check all the image sizes in the tree
 * @param {*} tree
 * @returns
 */

const isImage = (node) => {
  const { type } = node;
  if (type === 'image') return true;
  return false;
};

const getDimensions = (url) => {
  try {
    const dimensions = sizeOf(url);
    return dimensions;
  } catch (e) {
    return {};
  }
};

const remarkCheckImageSize = () => {
  return async (tree) => {
    tree.children = tree.children.map((node) => {
      if (isImage(node)) {
        const data = {
          hProperties: { ...getDimensions(`./public${node.url}`) },
        };

        const newNode = { ...node, data };
        return newNode;
      }
      return node;
    });

    return tree;
  };
};

export { remarkCheckImageSize as default };
