import { toString } from 'mdast-util-to-string';

const getTagName = (depth = 1) => `h${depth}`;

const lastHeading = (parent, newChild) => {
  const nodes = [parent];
  let child = parent.children[parent.children.length - 1] ?? parent;

  while (child.depth < newChild.depth) {
    const lastChild = child.children[child.children.length - 1];
    // when the items have the same tag, do not put it in children
    if (lastChild === undefined || lastChild?.depth === newChild?.depth) {
      nodes.push(child);
      break;
    }
    child = lastChild;
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

    let parent = {
      tag: 'h1',
      children: [],
    };

    headers.forEach((item) => {
      parent = lastHeading(parent, item);

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
        aSideMenuTree: parent.children,
      },
    });

    return tree;
  };
};

export { remarkHeadersToProps as default };
