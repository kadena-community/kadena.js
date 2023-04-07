import { ISubElement } from '@/types/Layout';

export const getParentHeading = (
  parent: ISubElement,
  newChild: HTMLHeadingElement,
): ISubElement => {
  const orderArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const nodes = [parent];
  let child = parent.children[parent.children.length - 1] ?? parent;

  while (
    orderArr.indexOf(child.tag.toLowerCase()) <
    orderArr.indexOf(newChild.tagName.toLowerCase())
  ) {
    // when the items has the same tag, do not put it in children
    if (
      child.children[child.children.length - 1] === undefined ||
      child.children[child.children.length - 1].tag ===
        newChild.tagName.toLowerCase()
    ) {
      nodes.push(child);
      break;
    }
    child = child.children[child.children.length - 1];
    nodes.push(child);
  }

  return nodes[nodes.length - 1];
};
