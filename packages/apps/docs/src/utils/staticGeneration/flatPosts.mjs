import { getData } from './getData.mjs';

export const flatPosts = (acc = [], val) => {
  const { children, ...newVal } = val;

  if (!children || !children.length) {
    return [...acc, newVal];
  }
  return [...acc, newVal, ...children.reduce(flatPosts, []).flat()];
};

export const getFlatData = () => {
  const data = getData();
  return data.reduce(flatPosts, []).flat();
};
