import { readFile } from 'fs/promises';
import { join } from 'path';
import type { IMenuData } from './../types';

const getData = async (): Promise<IMenuData[]> => {
  const configFilePath = join(process.cwd(), 'src/mock/menu.mock.json');
  const result = await readFile(configFilePath, 'utf-8');

  const data = JSON.parse(result);
  return data as IMenuData[];
};

export { getData };
