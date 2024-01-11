import fs from 'fs';
import copy from 'recursive-copy';
import type { IScriptResult } from './types';

const errors: string[] = [];
const success: string[] = [];

const COMMON_FAV_ICONS_PATH = '../../../common/images/icons/internal/default';
const PUBLIC_DIR = 'public/assets/favicons';

export const copyFavIcons = async (): Promise<IScriptResult> => {
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
