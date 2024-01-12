import chokidar from 'chokidar';
import { fixLocalLinks, fixLocalLinksSingle } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import { movePages } from './movePages';
import type { IEventType } from './movePages/singlePage';
import { moveSinglePage } from './movePages/singlePage';
import { initFunc } from './utils/build';

const runSingleChange = async (path: string): Promise<void> => {
  await initFunc(moveSinglePage(path), 'move a single page');
  await initFunc(fixLocalLinksSingle(path), 'Fix local links for single page');
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

  //when the config.yaml is changed, we need to rebuild the whole thing
  chokidar
    .watch('./src/config.yaml', { ignoreInitial: true })
    .on('all', async (event, path) => {
      await runAll(event, path);
    });
})();
