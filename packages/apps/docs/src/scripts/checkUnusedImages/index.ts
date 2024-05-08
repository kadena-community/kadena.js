import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getFileExtension } from '@kadena/docs-tools';
import * as fs from 'fs';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import { blogCrawl, crawlPage } from '../utils/crawlPage';
import type { IScriptResult } from './../types';
import { getFileNameOfPageFile } from './../utils/getFileNameOfPageFile';

interface IASSET {
  path: string;
  isUsed: boolean;
}

const errors: string[] = [];
const success: string[] = [];

const ASSETSDIR = [
  './public/assets/blog',
  './public/assets/docs',
  './public/assets/marmalade',
];

const isImage = (path: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const extension = getFileExtension(path);
  return imageExtensions.includes(extension);
};

const cleanPath = (path: string): string => {
  return path.replace('./public', '');
};

const crawlAssets = (assets: IASSET[]) => (path: string) => {
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const filePath = `${path}/${file}`;
    if (isImage(file)) {
      assets.push({
        path: cleanPath(filePath).toLowerCase(),
        isUsed: false,
      });
    } else if (fs.lstatSync(filePath).isDirectory()) {
      crawlAssets(assets)(filePath);
    }
  });
};

const getAllAssets = (): IASSET[] => {
  const assets: IASSET[] = [];
  ASSETSDIR.forEach(crawlAssets(assets));
  return assets;
};

const checkImagesContent = (
  path: string,
  content: string,
  assets: IASSET[],
) => {
  assets.forEach((asset) => {
    if (content.toLowerCase().includes(asset.path)) {
      asset.isUsed = true;
    }
  });
};

const checkBlogImages =
  (assets: IASSET[]) =>
  async (path: string): Promise<void> => {
    const content = fs.readFileSync(`${path}`, 'utf-8');

    checkImagesContent(path, content, assets);
  };

const checkImages =
  (assets: IASSET[]) =>
  async (
    page: IConfigTreeItem,
    parentTree: IConfigTreeItem[],
  ): Promise<void> => {
    const path = `./src/pages${getFileNameOfPageFile(page, parentTree)}`;
    const content = fs.readFileSync(path, 'utf-8');

    checkImagesContent(path, content, assets);
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

  await blogCrawl(checkBlogImages(assets));

  assets.forEach((asset) => {
    if (!asset.isUsed) {
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
