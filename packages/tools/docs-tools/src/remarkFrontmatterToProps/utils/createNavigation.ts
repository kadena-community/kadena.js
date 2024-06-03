import type { IFile, INavigation } from './../../types';
import { getPathName } from './../../utils/staticGeneration/checkSubTreeForActive';
import { getFlatData } from './../../utils/staticGeneration/flatPosts';
import { getFileName } from './getFileName';

/**
 * create a navigation object with the next and previous link in the navigation json.
 */
export const createNavigation = async (file: IFile): Promise<INavigation> => {
  const path = getPathName(getFileName(file));
  const flatData = await getFlatData();

  const itemIdx = flatData.findIndex((i) => {
    return i && (i.root === path || `${i.root}/` === path);
  });

  return {
    previous: flatData[itemIdx - 1] ?? undefined,
    next: flatData[itemIdx + 1] ?? undefined,
  };
};
