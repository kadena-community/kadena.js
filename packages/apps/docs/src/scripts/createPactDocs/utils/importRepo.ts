import { removeRepoDomain } from '@/scripts/importReadme';
import type { IImportReadMeItem } from '@/scripts/utils';
import { TEMP_DIR } from '@/scripts/utils/build';
import * as fs from 'fs';
import { clone } from './clone';

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
