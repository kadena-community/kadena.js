import chokidar from 'chokidar';
import { fixLocalLinks } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import { movePages } from './movePages';
import { initFunc } from './utils/build';

const run = async (): Promise<void> => {
  await initFunc(movePages, 'create foldertree from config.yaml');
  await initFunc(createDocsTree, 'Create docs tree');
  await initFunc(fixLocalLinks, 'fix local links from the config.yaml');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function async(): Promise<void> {
  chokidar
    .watch('./src/docs', { ignoreInitial: true })
    .on('all', async (event, path) => {
      console.log(event, path);
      await run();
    });

  await run();
})();
