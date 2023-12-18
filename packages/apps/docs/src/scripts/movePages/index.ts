import * as fs from 'fs';
import type { IPage, IScriptResult } from './../types';
import { promiseExec } from './../utils/build';
import { getFileExtension } from './utils/getFileExtension';
import { loadConfigPages } from './utils/loadConfigPages';

const errors: string[] = [];
const success: string[] = [];
const newFiles: string[] = [];

export const getLinkHash = (filePath: string): string | undefined => {
  const arr = filePath.split('/');
  const extensionWithHashArr = arr[arr.length - 1].split('.');

  //also remove the # at the end of a link
  const extensionArr =
    extensionWithHashArr[extensionWithHashArr.length - 1].split('#');

  if (extensionArr.length < 2) return;

  return extensionArr[1];
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
  errors.length = 0;
  success.length = 0;
  await cleanup();

  const pages = loadConfigPages();
  copyPages(pages);

  createGitIgnore(newFiles);

  success.push('There were no issues with copying the pages');
  return { errors, success };
};
