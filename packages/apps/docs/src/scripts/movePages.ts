import * as fs from 'fs';
import yaml from 'js-yaml';
import type { IConfig, IPage, IScriptResult } from './types';

const errors: string[] = [];
const success: string[] = [];
const newFiles: string[] = [];

const loadConfigPages = (): IPage[] => {
  const data = fs.readFileSync(`./src/config.yaml`, 'utf-8');
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

    fs.mkdirSync(`./src/pages${dir}`, { recursive: true });
    fs.copyFileSync(
      `./src${page.file}`,
      `./src/pages${dir}/index.${getFileExtension(page.file)}`,
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
  // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
  const regex = new RegExp(`^${filePath}$`, 'gm');
  return regex.test(existingContent);
};

const createGitIgnore = (files: string[]): void => {
  const existingContent = fs.readFileSync(`./src/pages/.gitignore`, 'utf-8');

  const content = files.reduce((acc, val) => {
    if (isAlreadyIgnored(val, existingContent)) return acc;

    return `${acc}\n${val}`;
  }, existingContent);

  fs.writeFileSync('./src/pages/.gitignore', content);
};

export const movePages = async (): Promise<IScriptResult> => {
  const pages = loadConfigPages();
  copyPages(pages);

  createGitIgnore(newFiles);

  success.push('There were no issues with copying the pages');
  return { errors, success };
};
