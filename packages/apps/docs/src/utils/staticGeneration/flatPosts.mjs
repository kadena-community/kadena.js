export const flatPosts = (acc = [], val) => {
  const { children, ...newVal } = val;

  if (!children || !children.length) {
    return [...acc, newVal];
  }
  return [...acc, newVal, ...children.reduce(flatPosts, []).flat()];
};

export const getFlatData = async () => {
  console.log(111);
  const { menuData: data } = await import('./../../_generated/menu.mjs');
  return data.reduce(flatPosts, []).flat();
};
