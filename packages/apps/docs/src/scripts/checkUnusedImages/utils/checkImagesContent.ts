import { cleanPath } from './cleanPath';

export const checkImagesContent = (content: string, assets: IASSET[]) => {
  assets.forEach((asset) => {
    if (content.toLowerCase().includes(cleanPath(asset.path))) {
      asset.isUsed = true;
    }
  });
};
