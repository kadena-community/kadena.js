import chokidar from 'chokidar';
import { fixLocalLinks } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import { movePages } from './movePages';
import type { IEventType } from './movePages/singlePage';
import { moveSinglePage } from './movePages/singlePage';
import { initFunc } from './utils/build';

const runSingleChange = async (path: string): Promise<void> => {
  await initFunc(moveSinglePage(path), 'Create folder tree from config.yaml');
  await initFunc(fixLocalLinks, 'Fix local links from the config.yaml');
};

const runAll = async (event: IEventType, path: string): Promise<void> => {
  await initFunc(movePages, 'Create folder tree from config.yaml');
  await initFunc(createDocsTree, 'Create docs tree');
  await initFunc(fixLocalLinks, 'Fix local links from the config.yaml');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function async(): Promise<void> {
  chokidar
    .watch('./src/docs', { ignoreInitial: true })
    .on('change', async (path) => {
      await runSingleChange(path);
    });

  chokidar
    .watch('./src/config.yaml', { ignoreInitial: true })
    .on('all', async (event, path) => {
      console.log(event, path);
      await runAll(event, path);
    });
})();
