import chokidar from 'chokidar';
import { detectBrokenLinks } from './detectBrokenLinks';
import { fixLocalLinks } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import { movePages } from './movePages';
import { initFunc } from './utils/build';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function (): Promise<void> {
  chokidar
    .watch('./src/docs', { ignoreInitial: true })
    .on('all', async (event, path) => {
      console.log(event, path);

      await initFunc(movePages, 'create foldertree from config.yaml');
      await initFunc(createDocsTree, 'Create docs tree');
      await initFunc(fixLocalLinks, 'fix local links from the config.yaml');
    });
})();
