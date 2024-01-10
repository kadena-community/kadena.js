import type { Content, Root } from 'mdast-util-from-markdown/lib';

export const getTypes = <T>(
  tree: Root | Content,
  type: string,
  arr: T[] = [],
): T[] => {
  if ('children' in tree) {
    tree.children.forEach((branch: Content) => {
      if (branch.type === type) {
        arr.push(branch as unknown as T);
      }
      getTypes(branch, type, arr);
    });
  }
  return arr;
};

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
