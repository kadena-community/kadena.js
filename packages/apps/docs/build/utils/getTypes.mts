import type { Content } from 'mdast';

export const getTypes = (tree: any, type: string, arr: Content[] = []) => {
  tree.children.forEach((branch) => {
    if (branch.type === type) {
      arr.push(branch);
    }
    if (!branch.children) return arr;

    return getTypes(branch, type, arr);
  });
  return arr as unknown as Content;
};
