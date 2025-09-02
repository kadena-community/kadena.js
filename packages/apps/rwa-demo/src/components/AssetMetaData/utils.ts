import type { IImageNode, INode, ITextNode } from './types';

// Type guard to check if an array is string[]
export const isStringArray = (
  arr: (string | ITextNode | IImageNode)[],
): arr is string[] => {
  return arr.some((item) => typeof item === 'string');
};

// Type guard to check if a node os a string
export const isStringNode = (node: INode): node is string => {
  return typeof node === 'string';
};

export const sortObject = (a: INode, b: INode) => {
  if (isStringNode(a) || isStringNode(b)) return 0;
  if (parseFloat(a.order) < parseFloat(b.order)) return -1;
  if (parseFloat(a.order) > parseFloat(b.order)) return 1;
  return 0;
};
