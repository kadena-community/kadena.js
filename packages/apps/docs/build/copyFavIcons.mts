import fs from 'fs';
import copy from 'recursive-copy';
import { BuildReturn, ErrorsReturn, SucccessReturn } from './types.mjs';

const errors: ErrorsReturn = [];
const success: SucccessReturn = [];

const COMMON_FAV_ICONS_PATH = '../../../common/images/icons/internal';
const PUBLIC_DIR = 'public/assets/favicons';

export const copyFavIcons = async (): Promise<BuildReturn> => {
  try {
    if (fs.existsSync(PUBLIC_DIR)) {
      fs.rmSync(PUBLIC_DIR, {
        recursive: true,
      });
    }

    const results = await copy(COMMON_FAV_ICONS_PATH, PUBLIC_DIR);
    success.push(`Copy fav icons ${results.length} files succeeded`);
  } catch (error) {
    errors.push(`Copy fav icons failed: ${error}`);
    console.error(`Copy fav icons failed: ${error}`);
  }

  return { errors, success };
};
