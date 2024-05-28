import {
  getFrontmatterFromTsx,
  getReadTime,
  isMarkDownFile,
} from '@kadena/docs-tools';
import * as fs from 'fs';
import { getFrontMatter } from './getFrontMatter';
import { getLastModifiedDate } from './getLastModifiedDate';
import { isIndex } from './isIndex';

export const convertFile = async (
  file: string,
): Promise<IConvertFileResult | undefined> => {
  const doc = fs.readFileSync(`${file}`, 'utf-8');
  let data;
  if (isMarkDownFile(file)) {
    data = getFrontMatter(doc, file);
  } else {
    data = getFrontmatterFromTsx(doc);
  }
  if (!data) return;

  const readTime = getReadTime(doc);
  const lastModifiedDate = data.lastModifiedDate
    ? data.lastModifiedDate
    : await getLastModifiedDate(
        `./kadena-community/kadena.js/packages/apps/docs/${file.substr(
          2,
          file.length - 1,
        )}`,
      );

  return {
    lastModifiedDate,
    ...data,
    ...readTime,
    isMenuOpen: false,
    isActive: false,
    isIndex: isIndex(file),
  };
};
