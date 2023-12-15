import { exec } from 'child_process';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { promisify } from 'util';
import type { IConfig, IPage, IScriptResult } from './types';

export const promiseExec = promisify(exec);

const errors: string[] = [];
const success: string[] = [];
const newFiles: string[] = [];

export const loadConfigPages = (): IPage[] => {
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

export const getFileExtension = (filePath: string): string => {
  const arr = filePath.split('/');
  const last = arr[arr.length - 1].split('.');
  return last[last.length - 1];
};

const copyPages = (pages: IPage[], parentDir: string = ''): void => {
  pages.forEach((page) => {
    const dir = `${parentDir}${page.url}`;
    const file = `${dir}/index.${getFileExtension(page.file)}`;

    fs.mkdirSync(`./src/pages${dir}`, { recursive: true });
    fs.copyFileSync(`./src/docs${page.file}`, `./src/pages${file}`);
    newFiles.push(file);

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

//this removes all the files in the /pages folder that are in the gitignore.
//this is needed for local development to make sure that files that are not needed are deleted
const cleanup = async (): Promise<void> => {
  try {
    await promiseExec(`cd ./src/pages && git clean -Xdf`);
  } catch (e) {
    errors.push('removing old files (via gitignore) has failed');
    await Promise.resolve();
  }
};

export const movePages = async (): Promise<IScriptResult> => {
  await cleanup();

  const pages = loadConfigPages();
  copyPages(pages);

  createGitIgnore(newFiles);

  success.push('There were no issues with copying the pages');
  return { errors, success };
};
