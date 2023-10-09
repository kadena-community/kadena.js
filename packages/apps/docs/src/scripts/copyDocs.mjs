import copy from 'recursive-copy';

const DOCSPATH = './src/_docs';

(async () => {
  const options = {
    overwrite: true,
  };

  const results = await copy(DOCSPATH, './src/pages', options);
  console.info(`Copy docs ${results.length} files succeeded`);
})();
