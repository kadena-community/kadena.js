import type { IMenuItem } from '@/Layout';
import { flattenData } from '@/utils/staticGeneration/flatPosts.mjs';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import yaml from './../../config.yaml' assert { type: 'yaml' };

export const getHeaderItems = (): IMenuItem[] => {
  const data = getData();
  const { menu } = yaml;

  return menu.map((item: string) => {
    const found = data.find((d) => d.root === `/${item}`);
    if (!found) return null;
    return found;
  });
};

export const getAllPages = (): IMenuItem[] => {
  const data = getData();
  const allPosts = flattenData(data) as IMenuItem[];

  return allPosts;
};
