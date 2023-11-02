import { exec } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { TEMPDIR, importDocs } from './createDoc.mjs';
import { removeRepoDomain } from './index.mjs';

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
  try {
    await promiseExec(`git clone ${repo} ${TEMPDIR}/${removeRepoDomain(repo)}`);
  } catch (e) {
    Promise.resolve();
  }
};

export const importRepo = async (item) => {
  await clone(item);

  await importDocs(
    `${TEMPDIR}${removeRepoDomain(item.repo)}${item.file}`,
    item,
  );
};
