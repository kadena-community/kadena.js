import * as fs from 'fs';
import yaml from 'js-yaml';
import type { IBuildReturn, IConfig, IError, IPage, ISuccess } from './types';

const errors: IError[] = [];
const success: ISuccess[] = [];

const loadConfigPages = (): IPage[] => {
  const data = fs.readFileSync(`./../config.yaml`, 'utf-8');
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

const copyPages = (pages: IPage[], parentDir: string = ''): void => {
  pages.forEach((page) => {
    fs.mkdirSync(`./../pages${parentDir}${page.url}`, { recursive: true });
    fs.copyFileSync(
      `./..${page.file}`,
      `./../pages${parentDir}${page.url}/index.md`,
    );

    if (page.children) {
      copyPages(page.children, `${parentDir}${page.url}`);
    }
  });
};

export const movePages = async (): Promise<IBuildReturn> => {
  const pages = loadConfigPages();
  copyPages(pages);

  success.push('There were no issues with copying the pages');
  return { errors, success };
};
