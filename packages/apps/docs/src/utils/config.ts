import type { IMenuItem } from '@/Layout';
import { flattenData } from '@/utils/staticGeneration/flatPosts.mjs';
import { getMenuData } from '@kadena/docs-tools';
import yaml from './../config.yaml';

export const getHeaderItems = async (): Promise<IMenuItem[]> => {
  const data = await getMenuData();
  const { menu } = yaml;

  return menu.map((item: string) => {
    const found = data.find((d) => d.root === `/${item}`);
    if (!found) return null;
    return found;
  });
};

export const getAllPages = async (): Promise<IMenuItem[]> => {
  const data = await getMenuData();
  const allPosts = flattenData(data) as IMenuItem[];

  return allPosts;
};
