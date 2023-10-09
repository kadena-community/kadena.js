import copy from 'recursive-copy';

const COMMON_FAV_ICONS_PATH = '../../../common/images/icons/internal';

(async function () {
  try {
    const results = await copy(COMMON_FAV_ICONS_PATH, 'public/assets/favicons');
    console.info(`Copy fav icons${results.length} files succeeded`);
  } catch (error) {
    console.error(`Copy fav icons failed: ${error}`);
  }
})();
