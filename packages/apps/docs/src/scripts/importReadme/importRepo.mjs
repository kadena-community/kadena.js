import { exec } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { importDocs } from './createDoc.mjs';

const REPOPREFIX = 'https://github.com/';
export const TEMPDIR = './.tempimport';

const promiseExec = promisify(exec);

/**
 * Removes the tempdir.
 */
export const deleteTempDir = () => {
  fs.rmSync(TEMPDIR, { recursive: true, force: true });
};

/**
 * @param {ImportItem} importItem
 */
const clone = async ({ repo }) => {
  deleteTempDir();

  await promiseExec(`git clone ${REPOPREFIX}${repo} ${TEMPDIR}/${repo}`);
};

export const importRepo = async (item) => {
  await clone(item);
  await importDocs(`${TEMPDIR}/${item.repo}/${item.file}`, item);

  deleteTempDir();
};
