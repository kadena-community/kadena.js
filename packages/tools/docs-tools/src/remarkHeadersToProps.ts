import { toString } from 'mdast-util-to-string';
import { getValues } from './utils.mjs';
import type { Heading, PhrasingContent } from 'mdast';
import type { DocsRootContent, IStartArray, ITree, Plugin, TagNameType } from './types';

const getTagName = (depth = 1) => `h${depth}` as TagNameType;

const lastHeading = (parent: IStartArray, newChild: Heading): IStartArray => {
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

const cleanupHeading = (item: Heading): void => {
  const newChild = {
    type: 'text',
    value: '',
  };

  const value = getValues(item).join(' ');

  item.children = [{ ...newChild, value }] as PhrasingContent[];
};


const getHeaders = (tree: ITree): Heading[]  => {
  return tree.children.filter((child: DocsRootContent) => {
    return child.type === 'heading';
  }) as Heading[];
};

const remarkHeadersToProps = (): Plugin => {
  return async (tree: ITree): Promise<ITree> => {
    const headers = getHeaders(tree);

    const startArray:IStartArray[] = [
      {
        type: 'heading',
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

      const elm: IStartArray = {
        type: item.type,
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
