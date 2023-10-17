import { toString } from 'mdast-util-to-string';
import { getValues } from './utils.mjs';

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

const cleanupHeading = (item) => {
  const newChild = {
    type: 'text',
    value: '',
    postion: {
      start: {},
      end: {},
    },
  };

  const value = getValues(item).join(' ');

  item.children = [{ ...newChild, value }];
};

const getHeaders = (tree) => {
  return tree.children.filter((branch) => {
    return branch.type === 'heading';
  });
};

const remarkHeadersToProps = () => {
  return async (tree) => {
    const headers = getHeaders(tree);

    let startArray = [
      {
        tag: 'h1',
        depth: 1,
        children: [],
      },
    ];

    headers.forEach((item) => {
      const parent = lastHeading(startArray[0], item);

      cleanupHeading(item);

      // we dont want h1 tags in the aside menu
      if (item.depth === 1) {
        return;
      }

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
