import * as fs from 'fs';
import { getSitemapLinkstoArray } from '../utils';

export const getSitemapLinks = async (): Promise<string[]> => {
  const xml = fs.readFileSync(
    `${__dirname}/../../../../public/sitemap.xml`,
    'utf-8',
  );
  return getSitemapLinkstoArray(xml);
};
