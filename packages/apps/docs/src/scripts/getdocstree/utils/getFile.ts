import type { IConfigTreeItem } from '@kadena/docs-tools';
import * as fs from 'fs';
import { INITIAL_PATH, SEARCHABLE_DIRS, errors } from '../constants';
import { convertFile } from './convertFile';
import { createTree } from './createTree';
import { findPath } from './findPath';
import { pushToParent } from './pushToParent';

export const getFile = async (
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

    // add the child to the parent array
    parent = pushToParent(parent, child as IParent, idx);
    console.log(45646, parent);

    if (fs.statSync(currentFile).isDirectory()) {
      console.log(111, child.children);
      child.children = await createTree(currentFile, child.children, pages);
      console.log(222, child.children);
      return child.children;
    }
  }
};
