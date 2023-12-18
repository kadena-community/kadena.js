import type { IConfig, IPage } from '@/scripts/types';
import * as fs from 'fs';
import yaml from 'js-yaml';

export const loadConfigPages = (): IPage[] => {
  const data = fs.readFileSync(`../config.mock.yaml`, 'utf-8');
  const { pages } = yaml.load(data) as IConfig;

  const cleanup = (pages: IPage[]): IPage[] => {
    const innerPages = Object.entries(pages);

    return innerPages.map(([key, page]: [string, IPage]) => {
      if (page.children) page.children = cleanup(page.children);

      return { ...page, id: key } as IPage;
    });
  };

  return cleanup(pages);
};
