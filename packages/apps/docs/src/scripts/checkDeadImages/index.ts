import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getFileExtension } from '@kadena/docs-tools';
import * as fs from 'fs';
import type { Image } from 'mdast';

import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { getUrlofImageFile } from '../fixLocalLinks/utils/getUrlofImageFile';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import { blogCrawl, crawlPage } from '../utils/crawlPage';
import type { IScriptResult } from './../types';
import { getTypes } from './../utils';
import { getFileNameOfPageFile } from './../utils/getFileNameOfPageFile';

const errors: string[] = [];
const success: string[] = [];

export const isLocalImageLink = ({ url }: Image): boolean => {
  return !url.startsWith('http') && url.includes('assets');
};

const checkImagesContent = (content: string, fileName) => {
  const md: Root = remark.parse(content);
  const images = getTypes<Image>(md, 'image');

  images.forEach((image) => {
    if (isLocalImageLink(image)) {
      image.url = getUrlofImageFile(image.url);
      if (!fs.existsSync(`./public${image.url}`)) {
        errors.push(`${image.url} does not exist (page: ${fileName})`);
      }
    }
  });
};

const checkImages = async (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
): Promise<void> => {
  const extenstion = getFileExtension(page.file);
  if (extenstion !== 'md' && extenstion !== 'mdx') return;

  const content = fs.readFileSync(
    `./src/pages${getFileNameOfPageFile(page, parentTree)}`,
    'utf-8',
  );

  checkImagesContent(content, page.file);
};

const checkBlogImages = async (path: string): Promise<void> => {
  const content = fs.readFileSync(path, 'utf-8');
  checkImagesContent(content, path);
};

export const checkDeadImages = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  const pages = loadConfigPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await crawlPage(page, [], checkImages);
  }
  await blogCrawl(checkBlogImages);

  if (!errors.length) {
    success.push('No dead images found');
  } else {
    errors.push(`${errors.length} dead images found`);
  }

  return { errors, success };
};
