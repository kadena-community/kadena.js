import * as fs from 'fs';
import chalk from 'chalk';
import {
  getAuthorData,
  getTagsData,
} from './../utils/staticGeneration/getData.mjs';
import { getFlatData } from './../utils/staticGeneration/flatPosts.mjs';
import { format, isValid } from 'date-fns';

const MENUFILE = './public/sitemap.xml';
const URL = 'https://docs.kadena.io';

const errors = [];
const success = [];
const posts = getFlatData();
const authors = getAuthorData();
const tags = getTagsData();

const setPrio = (root) => {
  if (root.includes('/blogchain')) return '0.5';

  return '1';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (!isValid(date)) return '';

  return format(date, 'yyyy-MM-dd');
};

const getPosts = (root) => {
  return posts
    .map(
      (post) => `
    <url>
      <loc>${root}${post.root}}</loc>
      ${
        post.lastModifiedDate &&
        `<lastmod>${formatDate(post.lastModifiedDate)}</lastmod>`
      }
      <changefreq>monthly</changefreq>
      <priority>${setPrio(post.root)}</priority>
    </url>`,
    )
    .join('');
};

const getTags = (root) => {
  return tags
    .map(
      (tag) => `
    <url>
      <loc>${root}/tags/${encodeURIComponent(tag.tag)}</loc>
    </url>`,
    )
    .join('');
};

const getAuthors = (root) => {
  return authors
    .map(
      (author) => `
    <url>
      <loc>${root}/authors/${encodeURIComponent(author.id)}</loc>
    </url>`,
    )
    .join('');
};

export const createSitemap = async () => {
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
      ${getTags(URL)}
    <url>  
      <loc>${URL}/authors</loc>
    </url>  
    ${getAuthors(URL)}
    <url>
      <loc>${URL}/help</loc>
    </url>
    ${getPosts(URL)}
    </urlset>`;

  if (errors.length) {
    errors.map((error) => {
      errors.push(error);
    });
  } else {
    fs.writeFileSync(MENUFILE, fileStr);

    success.push('sitemap successfully created');
  }

  return { errors, success };
};
