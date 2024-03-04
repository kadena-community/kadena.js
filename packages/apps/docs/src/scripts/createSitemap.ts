import type { IMenuData } from '@kadena/docs-tools';
import { getFlatData } from '@kadena/docs-tools';
import { format, isValid } from 'date-fns';
import * as fs from 'fs';
import type { ITagsData } from '../utils/staticGeneration/getJsonData';
import {
  getAuthorData,
  getTagsData,
} from '../utils/staticGeneration/getJsonData';
import type { IScriptResult } from './types';

const MENU_FILE = './public/sitemap.xml';
const URL = 'https://docs.kadena.io';

const errors: string[] = [];
const success: string[] = [];

const authors = getAuthorData();

const setPriority = (root: string): string => {
  if (root.includes('/blogchain')) return '0.5';

  return '1';
};

const formatDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  if (!isValid(date)) return '';

  return format(date, 'yyyy-MM-dd');
};

const getPosts = (root: string, posts: IMenuData[]): string => {
  return posts
    .map(
      (post) => `
    <url>
      <loc>${root}${post.root}</loc>
      ${
        post.lastModifiedDate &&
        `<lastmod>${formatDate(post?.lastModifiedDate)}</lastmod>`
      }
      <changefreq>monthly</changefreq>
      <priority>${setPriority(post.root)}</priority>
    </url>`,
    )
    .join('');
};

const getTags = (root: string, tags: ITagsData[]): string => {
  return tags
    .map(
      (tag) => `
    <url>
      <loc>${root}/tags/${encodeURIComponent(tag.tag)}</loc>
    </url>`,
    )
    .join('');
};

const getAuthors = (root: string): string => {
  return authors
    .map(
      (author) => `
    <url>
      <loc>${root}/authors/${encodeURIComponent(author.id)}</loc>
    </url>`,
    )
    .join('');
};

export const createSitemap = async (): Promise<IScriptResult> => {
  const tags = await getTagsData();
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
      <loc>${URL}/tags</loc>
    </url>
      ${getTags(URL, tags)}
    <url>
      <loc>${URL}/authors</loc>
    </url>
    ${getAuthors(URL)}
    <url>
      <loc>${URL}/help</loc>
    </url>
    ${getPosts(URL, posts)}
    </urlset>`;

  if (errors.length) {
    errors.map((error) => {
      errors.push(error);
    });
  } else {
    fs.writeFileSync(MENU_FILE, fileStr);

    success.push('sitemap successfully created');
  }

  return { errors, success };
};
