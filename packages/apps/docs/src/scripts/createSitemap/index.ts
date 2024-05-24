import changelogs from '@/data/changelogs.json';
import type { IScriptResult } from '@kadena/docs-tools';
import { getFlatData } from '@kadena/docs-tools';
import * as fs from 'fs';

import { MENU_FILE, URL, errors, success } from './utils/constants';
import { getChangelogs } from './utils/getChangelogs';
import { getPosts } from './utils/getPosts';

export const createSitemap = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;
  try {
    const posts = await getFlatData();

    const fileStr = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${URL}/</loc>
      </url>
      <url>
        <loc>${URL}/search</loc>
      </url>
      <url>
        <loc>${URL}/changelogs</loc>
      </url>
      ${getChangelogs(`${URL}/changelogs`, changelogs as unknown as IChangelogComplete)}
      ${getPosts(URL, posts)}
      </urlset>`;

    fs.writeFileSync(MENU_FILE, fileStr);
    console.log(999);
    success.push('sitemap successfully created');
  } catch (e) {
    errors.push('Something went wrong');
  }

  return { errors, success };
};
