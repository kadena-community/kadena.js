import { readFile } from 'fs/promises';
import { join } from 'path';
import type { IMenuData } from '../../types';

export const getData = async (): Promise<IMenuData[]> => {
  const menuFilePath = join(process.cwd(), 'src/_generated/menu.json');
  try {
    const fileData = await readFile(menuFilePath, 'utf-8');
    const menuData = JSON.parse(fileData);
    return menuData;
  } catch (e) {
    console.error(e);
    throw new Error('Could not load menu data');
  }
};
