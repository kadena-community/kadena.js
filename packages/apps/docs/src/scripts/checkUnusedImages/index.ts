import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getFileExtension } from '@kadena/docs-tools';
import * as fs from 'fs';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import { crawlPage } from '../utils/crawlPage';
import type { IScriptResult } from './../types';
import { getFileNameOfPageFile } from './../utils/getFileNameOfPageFile';

interface IASSET {
  path: string;
  isUsed: boolean;
}

const errors: string[] = [];
const success: string[] = [];

const IGNOREASSETS: string[] = [];

const ASSETSDIR = [
  './public/assets/blog',
  './public/assets/docs',
  './public/assets/marmalade',
];

const cleanPath = (path: string): string => {
  return path.replace('./public', '').toLowerCase();
};

const isIgnoredImage = (ignoredAssets: string[], path: string): boolean => {
  return !!ignoredAssets.find((asset) => {
    console.log(cleanPath(asset) === cleanPath(path));
    return cleanPath(asset) === cleanPath(path);
  });
};

const isImage = (path: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const extension = getFileExtension(path);
  return imageExtensions.includes(extension);
};

const crawlAssets = (assets: IASSET[]) => (path: string) => {
  if (!fs.existsSync(path)) return;

  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const filePath = `${path}/${file}`;
    if (isImage(file)) {
      assets.push({
        path: cleanPath(filePath),
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

const checkImagesContent = (content: string, assets: IASSET[]) => {
  assets.forEach((asset) => {
    if (content.toLowerCase().includes(asset.path)) {
      asset.isUsed = true;
    }
  });
};

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

  console.log(errors);
  return { errors, success };
};

checkUnusedImages();
