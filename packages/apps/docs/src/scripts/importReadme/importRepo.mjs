import * as fs from 'fs';
import { TEMPDIR, importDocs } from './createDoc.mjs';
import { clone, removeRepoDomain } from './index.mjs';

/**
 * Removes the tempdir.
 */
export const deleteTempDir = () => {
  fs.rmSync(TEMPDIR, { recursive: true, force: true });
};

export const importRepo = async (item) => {
  await clone(item.repo);

  await importDocs(
    `${TEMPDIR}${removeRepoDomain(item.repo)}${item.file}`,
    item,
  );
};
