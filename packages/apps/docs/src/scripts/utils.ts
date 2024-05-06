import type { Node, Parent, Text } from 'mdast';

export function isParent(node: Node): node is Parent {
  return 'children' in node;
}

export function hasValue(node: Node): node is Text {
  return 'value' in node;
}

export function getTypes<T>(tree: Node, type: string, arr: T[] = []): T[] {
  if (isParent(tree)) {
    tree.children.forEach((branch) => {
      if (branch.type === type) {
        arr.push(branch as unknown as T);
      }
      getTypes(branch, type, arr);
    });
  }
  return arr;
}

interface IImportReadMeItemOptions {
  RootOrder: number;
  tags?: string[];
  hideEditLink?: boolean;
  singlePage?: boolean;
}

export interface IImportReadMeItem {
  file: string;
  repo: string;
  destination: string;
  title: string;
  options: IImportReadMeItemOptions;
}
