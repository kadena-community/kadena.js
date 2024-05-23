import type { IConfigTreeItem, IScriptResult } from '@kadena/docs-tools';
import {
  getParentTreeFromPage,
  getUrlNameOfPageFile,
} from '@kadena/docs-tools';
import * as fs from 'fs';
import { removeRepoDomain } from '../importReadme';
import { noImportRepo } from '../importReadme/importRepo';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import type { IImportReadMeItem } from '../utils';
import { TEMP_DIR, promiseExec } from '../utils/build';
import {
  CONTENTPLACEHOLDER,
  PACTREPO,
  errors,
  success,
} from './utils/constants';

// TODO: this is temporary to checkout the correct branch. we can use the normal clone function when done
export const clone = async (repo: string): Promise<void> => {
  try {
    await promiseExec(
      `git clone https://github.com${removeRepoDomain(
        repo,
      )} ${TEMP_DIR}/${removeRepoDomain(repo)}`,
    );
  } catch (e) {
    await Promise.resolve();
  }

  //TODO: remove the PR info
  await promiseExec(
    `cd ${TEMP_DIR}/${removeRepoDomain(repo)} && git checkout rsoeldner/docs`,
  );
};

export const importRepo = async (item: IImportReadMeItem): Promise<string> => {
  await clone(item.repo);

  // get all files from the correct directory
  const contentDir = `${TEMP_DIR}/${removeRepoDomain(item.repo)}${item.dir}`;
  const files = fs.readdirSync(contentDir);

  const content = files.reduce((acc, val) => {
    const content = fs.readFileSync(`${contentDir}/${val}`, 'utf8');
    return acc + content;
  }, '');

  return content;
};

const copyPages = async (
  pages: IConfigTreeItem[],
  parentDir: string = '',
): Promise<void> => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.repo === PACTREPO) {
      const parentTree = await getParentTreeFromPage(page);
      page.destination = getUrlNameOfPageFile(page, parentTree ?? []);

      let content;
      if (process.env.IGNOREREPO) {
        content = await noImportRepo(page, parentTree);
      } else {
        content = await importRepo(page as unknown as IImportReadMeItem);
      }

      const destination = `./src/pages${page.destination}/index.md`;
      const pageContent = fs.readFileSync(destination, 'utf8');

      const newContent = pageContent.replace(CONTENTPLACEHOLDER, content);

      fs.writeFileSync(destination, newContent);
    }

    if (page.children) {
      await copyPages(page.children, `${parentDir}${page.url}`);
    }
  }
};

export const createPactDocs = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  const pages = loadConfigPages();
  await copyPages(pages);

  if (!errors.length) {
    success.push('pact docs created');
  }
  return { errors, success };
};
