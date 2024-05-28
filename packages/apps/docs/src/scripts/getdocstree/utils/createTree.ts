import type { IConfigTreeItem } from '@kadena/docs-tools';
import * as fs from 'fs';
import { getFile } from './getFile';

export const createTree = async (
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
