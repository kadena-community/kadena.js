import type { IConfigTreeItem } from '@kadena/docs-tools';
import * as fs from 'fs';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import { crawlPage } from '../utils/crawlPage';
import type { IScriptResult } from './../types';
import { getFileNameOfPageFile } from './../utils/getFileNameOfPageFile';
import { checkImagesContent } from './utils/checkImagesContent';
import { getAllAssets } from './utils/getAllAssets';
import { isIgnoredImage } from './utils/isIgnoredImage';

const errors: string[] = [];
const success: string[] = [];

const IGNOREASSETS: string[] = [];

export const ASSETSDIR = [
  './public/assets/blog',
  './public/assets/docs',
  './public/assets/marmalade',
];

const checkImages =
  (assets: IASSET[]) =>
  async (
    page: IConfigTreeItem,
    parentTree: IConfigTreeItem[],
  ): Promise<void> => {
    const path = `./src/pages${getFileNameOfPageFile(page, parentTree)}`;
    const content = fs.readFileSync(path, 'utf-8');
    checkImagesContent(content, assets);
  };

export const checkUnusedImages = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  const assets = getAllAssets();
  const pages = loadConfigPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await crawlPage(page, [], checkImages(assets));
  }

  assets.forEach((asset) => {
    if (!asset.isUsed && !isIgnoredImage(IGNOREASSETS, asset.path)) {
      errors.push(`${asset.path} image is not used anywhere`);
    }
  });

  if (!errors.length) {
    success.push('No unused assets found');
  } else {
    errors.push(`${errors.length} unused assets found`);
  }

  return { errors, success };
};
