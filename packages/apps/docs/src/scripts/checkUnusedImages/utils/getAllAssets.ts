import * as fs from 'fs';
import { ASSETSDIR } from '..';
import { cleanPath } from './cleanPath';
import { isImage } from './isImage';

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

export const getAllAssets = (): IASSET[] => {
  const assets: IASSET[] = [];
  ASSETSDIR.forEach(crawlAssets(assets));
  return assets;
};
