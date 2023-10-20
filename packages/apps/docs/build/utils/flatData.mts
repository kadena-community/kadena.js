import { flatPosts } from './flatPosts.mjs';

export const getFlatData = async () => {
  const { menuData: data } = await import('./../../src/_generated/menu.mjs');
  return data.reduce(flatPosts, []).flat();
};
