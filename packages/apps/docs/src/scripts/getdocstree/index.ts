import type { IConfigTreeItem, IScriptResult } from '@kadena/docs-tools';
import { getPages } from '@kadena/docs-tools';
import * as fs from 'fs';
import {
  INITIAL_PATH,
  MENU_FILE,
  MENU_FILE_DIR,
  SEARCHABLE_DIRS,
  TREE,
  errors,
  success,
} from './constants';

import { findPath } from './utils/findPath';

import { convertFile } from './utils/convertFile';
import { pushToParent } from './utils/pushToParent';

const createTree = async (
  rootDir: string,
  parent: IParent[] = [],
  pages: IConfigTreeItem[],
): Promise<IParent[]> => {
  const files = fs.readdirSync(rootDir);

  const newFiles: string[] = [];
  //set the files in the right order

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const fileIdx = pages.reduce((acc, val, idx) => {
      if (val.url.endsWith(file)) return idx;

      return acc;
    }, -1);
    if (fileIdx > -1) {
      newFiles[fileIdx] = file;
    }
  }

  for (let i = 0; i < newFiles.length; i++) {
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define*/
    const pageChildren = pages[i].children ?? [];

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await getFile(rootDir, parent, newFiles[i], pageChildren, i);
  }

  return parent;
};

const getFile = async (
  rootDir: string,
  parent: IParent[],
  file: string,
  pages: IConfigTreeItem[],
  idx: number,
): Promise<IParent[] | undefined> => {
  const currentFile = `${rootDir}/${file}`;
  const arr: IParent[] = [];
  const child: Partial<IParent> = {
    children: arr,
  };
  child.root = findPath(currentFile);

  if (!child.root) return;

  if (
    SEARCHABLE_DIRS.some((item) => {
      return currentFile.startsWith(`${INITIAL_PATH}${item}`);
    })
  ) {
    if (fs.statSync(`${currentFile}`).isFile()) {
      const obj = await convertFile(currentFile);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.md`)) {
      const obj = await convertFile(`${currentFile}/index.md`);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.mdx`)) {
      const obj = await convertFile(`${currentFile}/index.mdx`);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.tsx`)) {
      const obj = await convertFile(`${currentFile}/index.tsx`);
      Object.assign(child, obj);
    } else {
      const files = fs.readdirSync(currentFile);

      // when the directory is empty, just remove the directory.
      // if there are files or subdirectories and no index file, give error
      if (files.length > 0) {
        errors.push(
          `${currentFile}: there is no index.[md|mdx|tsx] in this directory`,
        );
      }
    }

    parent = pushToParent(parent, child as IParent, idx);

    if (fs.statSync(currentFile).isDirectory()) {
      child.children = await createTree(currentFile, child.children, pages);

      return child.children;
    }
  }
};

export const createDocsTree = async (): Promise<IScriptResult> => {
  const pages = await getPages();
  // fill the SEARCHABLE_DIRS
  pages.forEach((p) => {
    SEARCHABLE_DIRS.push(p.url);
  });

  const result = await createTree(INITIAL_PATH, TREE, pages);

  fs.mkdirSync(MENU_FILE_DIR, { recursive: true });
  fs.writeFileSync(
    `${MENU_FILE_DIR}/${MENU_FILE}`,
    JSON.stringify(result, null, 2),
  );

  if (!errors.length) {
    success.push('Docs imported from monorepo');
  }

  return { errors, success };
};
