function hasChildren(content: any): content is {
  children: any[];
} {
  return 'children' in content;
}

export const getTypes = <T>(tree: any, type: string, arr: T[] = []): T[] => {
  if (hasChildren(tree)) {
    tree.children.forEach((branch) => {
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
