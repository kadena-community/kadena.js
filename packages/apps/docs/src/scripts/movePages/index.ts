import type { IConfigTreeItem } from '@kadena/docs-tools';
import {
  getFileExtension,
  getParentTreeFromPage,
  getUrlNameOfPageFile,
} from '@kadena/docs-tools';
import * as fs from 'fs';
import { importRepo, noImportRepo } from '../importReadme/importRepo';
import type { IImportReadMeItem } from '../utils';
import type { IScriptResult } from './../types';
import { promiseExec } from './../utils/build';
import { loadConfigPages } from './utils/loadConfigPages';

const errors: string[] = [];
const success: string[] = [];
const IGNORED_REPOS = ['https://github.com/kadena-io/pact-5'];

export const checkIgnoredRepos = (repo: string) => {
  return IGNORED_REPOS.includes(repo);
};

export const copyPage = (parentDir: string, page: IConfigTreeItem): void => {
  const dir = `${parentDir}${page.url}`;
  const file = `${dir}/index.${getFileExtension(page.file)}`;

  fs.mkdirSync(`./src/pages${dir}`, { recursive: true });
  fs.copyFileSync(`./src/docs${page.file}`, `./src/pages${file}`);
};

const copyPages = async (
  pages: IConfigTreeItem[],
  parentDir: string = '',
): Promise<void> => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.repo && !checkIgnoredRepos(page.repo)) {
      const parentTree = await getParentTreeFromPage(page);
      page.destination = getUrlNameOfPageFile(page, parentTree ?? []);

      if (process.env.IGNOREREPO) {
        await noImportRepo(page, parentTree);
      } else {
        await importRepo(page as unknown as IImportReadMeItem);
      }
    } else {
      copyPage(parentDir, page);
    }

    if (page.children) {
      await copyPages(page.children, `${parentDir}${page.url}`);
    }
  }
};

export const isAlreadyIgnored = (
  filePath: string,
  existingContent: string,
): boolean => {
  // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
  const regex = new RegExp(`^${filePath}$`, 'gm');
  return regex.test(existingContent);
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
  await copyPages(pages);

  success.push('There were no issues with copying the pages');
  return { errors, success };
};
