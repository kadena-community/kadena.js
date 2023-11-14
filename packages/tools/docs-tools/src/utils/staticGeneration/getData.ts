import { join } from 'path';
import type { IMenuData } from '../../types';

export const getData = async (): Promise<IMenuData[]> => {
  const menuFilePath = join(process.cwd(), 'src/_generated/menu.mjs');
  const { menuData } = await import(menuFilePath);
  return menuData;
};
