import type { ISubHeaderElement } from '@/Layout';

/**
 * Function used for creating a nested list of all headers in a document.
 * It finds the parentHeading where the child header should be nested
 */
export const getParentHeading = (
  parent: ISubHeaderElement,
  newChild: HTMLHeadingElement,
): ISubHeaderElement => {
  const orderArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const nodes = [parent];
  let child = parent.children[parent.children.length - 1] ?? parent;

  while (
    orderArr.indexOf(child.tag.toLowerCase()) <
    orderArr.indexOf(newChild.tagName.toLowerCase())
  ) {
    const getLastChild = child.children[child.children.length - 1];

    // when the items have the same tag, do not put it in children
    if (
      getLastChild === undefined ||
      getLastChild.tag === newChild.tagName.toLowerCase()
    ) {
      nodes.push(child);
      break;
    }
    child = getLastChild;
    nodes.push(child);
  }

  return nodes[nodes.length - 1];
};
