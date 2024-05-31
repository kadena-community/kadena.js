import type { IMenuData } from 'src/types';
import { getFlatData } from './../../utils/staticGeneration/flatPosts';

export const getCurrentPostFromJson = async (
  root: string,
): Promise<IMenuData | undefined> => {
  const data = await getFlatData();

  return data.find((item) => {
    return item && (item.root === root || `${item.root}/` === root);
  });
};
