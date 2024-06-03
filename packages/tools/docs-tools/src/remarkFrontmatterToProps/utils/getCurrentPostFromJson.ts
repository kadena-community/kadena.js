import type { IMenuData } from 'src/types';
import { getFlatData } from './../../utils/staticGeneration/flatPosts';

/**
 * from the given url get the IMenuData from the menujson data
 */
export const getCurrentPostFromJson = async (
  root: string,
): Promise<IMenuData | undefined> => {
  const data = await getFlatData();

  return data.find((item) => {
    return item && (item.root === root || `${item.root}/` === root);
  });
};
