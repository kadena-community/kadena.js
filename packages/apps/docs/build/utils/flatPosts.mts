export const flatPosts = (acc = [], val) => {
  const { children, ...newVal } = val;

  if (!children || !children.length) {
    return [...acc, newVal];
  }
  return [...acc, newVal, ...children.reduce(flatPosts, []).flat()];
};
