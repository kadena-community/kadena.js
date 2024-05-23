import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getFileExtension } from '@kadena/docs-tools';
import * as fs from 'fs';
import type { Image } from 'mdast';

import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { getUrlofImageFile } from '../fixLocalLinks/utils/getUrlofImageFile';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import { crawlPage } from '../utils/crawlPage';
import type { IScriptResult } from './../types';
import { getTypes } from './../utils';
import { getFileNameOfPageFile } from './../utils/getFileNameOfPageFile';

const errors: string[] = [];
const success: string[] = [];

export const isLocalImageLink = ({ url }: Image): boolean => {
  return !url.startsWith('http') && url.includes('assets');
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

  const md: Root = remark.parse(content);
  const images = getTypes<Image>(md, 'image');

  images.forEach((image) => {
    if (isLocalImageLink(image)) {
      image.url = getUrlofImageFile(image.url);
      if (!fs.existsSync(`./public${image.url}`)) {
        errors.push(`${image.url} does not exist (page: ${page.file})`);
      }
    }
  });
};

export const checkDeadImages = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  const pages = loadConfigPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await crawlPage(page, [], checkImages);
  }

  if (!errors.length) {
    success.push('Locallinks are fixed');
  } else {
    errors.push(`${errors.length} dead images found`);
  }

  return { errors, success };
};
