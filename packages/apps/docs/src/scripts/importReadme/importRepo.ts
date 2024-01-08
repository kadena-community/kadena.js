import * as fs from 'fs';
import type { IImportReadMeItem } from '../utils';
import { TEMP_DIR } from '../utils/build';
import { importDocs } from './createDoc';
import { clone, removeRepoDomain } from './index';

/**
 * Removes the tempdir.
 */
export const deleteTempDir = (): void => {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
};

export const importRepo = async (item: IImportReadMeItem): Promise<void> => {
  await clone(item.repo);

  console.log(item);
  await importDocs(
    `${TEMP_DIR}${removeRepoDomain(item.repo)}${item.file}`,
    item,
  );
};
