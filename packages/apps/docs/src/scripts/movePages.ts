import * as fs from 'fs';
import yaml from 'js-yaml';
import type { IBuildReturn, IConfig, IError, IPage, ISuccess } from './types';

const errors: IError[] = [];
const success: ISuccess[] = [];
const newFiles: string[] = [];

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

const getFileExtension = (filePath: string): string => {
  const arr = filePath.split('/');
  const last = arr[arr.length - 1].split('.');
  return last[last.length - 1];
};

const copyPages = (pages: IPage[], parentDir: string = ''): void => {
  pages.forEach((page) => {
    const dir = `${parentDir}${page.url}`;

    fs.mkdirSync(`./../pages${dir}`, { recursive: true });
    fs.copyFileSync(
      `./..${page.file}`,
      `./../pages${dir}/index.${getFileExtension(page.file)}`,
    );
    newFiles.push(dir);

    if (page.children) {
      copyPages(page.children, `${parentDir}${page.url}`);
    }
  });
};

const isAlreadyIgnored = (
  filePath: string,
  existingContent: string,
): boolean => {
  console.log(111, existingContent);

  const regex = new RegExp(`^${filePath}$`, 'gm');
  return regex.test(existingContent);
};

const createGitIgnore = (files: string[]): void => {
  const existingContent = fs.readFileSync(`./../pages/.gitignore`, 'utf-8');

  const content = files.reduce((acc, val) => {
    if (isAlreadyIgnored(val, existingContent)) return acc;

    return `${acc}\n${val}`;
  }, existingContent);

  fs.writeFileSync('./../pages/.gitignore', content);
};

export const movePages = async (): Promise<IBuildReturn> => {
  const pages = loadConfigPages();
  copyPages(pages);

  createGitIgnore(newFiles);

  success.push('There were no issues with copying the pages');
  return { errors, success };
};
