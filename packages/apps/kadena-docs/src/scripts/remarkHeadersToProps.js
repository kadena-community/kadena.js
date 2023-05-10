import { toString } from 'mdast-util-to-string';

const getTagName = (depth = 1) => `h${depth}`;

const getParentHeading = (parent, newChild) => {
  const orderArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const nodes = [parent];
  let child = parent.children[parent.children.length - 1] ?? parent;

  while (child.depth < newChild.depth) {
    const getLastChild = child.children[child.children.length - 1];
    // when the items have the same tag, do not put it in children
    if (getLastChild === undefined || getLastChild?.depth === newChild?.depth) {
      nodes.push(child);
      break;
    }
    child = getLastChild;
    nodes.push(child);
  }

  return nodes[nodes.length - 1];
};

const getHeaders = (tree) => {
  return tree.children.filter((branch) => {
    return branch.type === 'heading';
  });
};

const remarkHeadersToProps = () => {
  return async (tree) => {
    const headers = getHeaders(tree);

    const startArray = [
      {
        tag: 'h1',
        children: [],
      },
    ];

    let parent = startArray[0];

    headers.forEach((item) => {
      parent = getParentHeading(startArray[0], item);

      const elm = {
        depth: item.depth,
        tag: getTagName(item.depth),
        title: toString(item) ?? '',
        children: [],
      };
      parent.children.push(elm);
    });

    tree.children.push({
      type: 'props',
      data: {
        aSideMenuTree: startArray[0].children,
      },
    });

    return tree;
  };
};

export { remarkHeadersToProps as default };
