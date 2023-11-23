import type { IHeaderItem } from '@/Layout';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import yaml from './../../config.yaml';

export const getHeaderItems = (): IHeaderItem[] => {
  const data = getData();
  const { menu } = yaml;

  return menu.map((item: string) => {
    const found = data.find((d) => d.root === `/${item}`);
    if (!found) return null;
    return found;
  });
};
