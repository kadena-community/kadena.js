import copy from 'recursive-copy';

const DOCSPATH = './src/_docs';

(async function () {
  try {
    const results = await copy(DOCSPATH, './src/pages');
    console.info(`Copy docs ${results.length} files succeeded`);
  } catch (error) {
    console.error(`Copy docs failed: ${error}`);
  }
})();
