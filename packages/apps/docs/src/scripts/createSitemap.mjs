import * as fs from 'fs';
import chalk from 'chalk';
import {
  getAuthorData,
  getTagsData,
} from './../utils/staticGeneration/getData.mjs';
import { getFlatData } from './../utils/staticGeneration/flatPosts.mjs';

const MENUFILE = './public/sitemap.xml';
const URL = 'https://docs.kadena.io';

const errors = [];
const posts = getFlatData();
const authors = getAuthorData();
const tags = getTagsData();

const getPosts = (root) => {
  return posts
    .map(
      (post) => `
    <url>
      <loc>${root}${post.root}}</loc>
      <lastmod>${post.lastModifiedDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1</priority>
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

const init = () => {
  console.log(
    '========================================== START CREATE SITEMAP ==\n\n',
  );

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
      console.warn(chalk.red('⨯'), error);
    });
    process.exitCode = 1;
  } else {
    fs.writeFileSync(MENUFILE, fileStr);

    console.log(chalk.green('✓'), 'SITEMAP CREATED');
  }

  console.log(
    '========================================== END CREATE SITEMAP ====\n\n',
  );
};

init();
