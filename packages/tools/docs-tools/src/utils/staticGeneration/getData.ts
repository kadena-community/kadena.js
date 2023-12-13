import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { join } from 'path';
import type { IConfig, IMenuData } from '../../types';

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

export const getConfig = async (): Promise<IConfig> => {
  const configFilePath = join(process.cwd(), 'src/config.yaml');
  try {
    const configData = await readFile(configFilePath, 'utf-8');
    return yaml.load(configData) as IConfig;
  } catch (e) {
    console.error(e);
    throw new Error('Could not load config yaml');
  }
};
