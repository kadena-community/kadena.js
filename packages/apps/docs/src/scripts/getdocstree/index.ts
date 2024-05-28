import type { IScriptResult } from '@kadena/docs-tools';
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
import { createTree } from './utils/createTree';

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
