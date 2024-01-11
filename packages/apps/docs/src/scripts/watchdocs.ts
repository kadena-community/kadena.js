import chokidar from 'chokidar';
import { fixLocalLinks } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import type { IEventType } from './movePages/singlepage';
import { moveSinglePage } from './movePages/singlepage';
import { initFunc } from './utils/build';

const run = async (event: IEventType, path: string): Promise<void> => {
  await initFunc(
    moveSinglePage(event, path),
    'Create folder tree from config.yaml',
  );
  await initFunc(createDocsTree, 'Create docs tree');
  await initFunc(fixLocalLinks, 'Fix local links from the config.yaml');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function async(): Promise<void> {
  chokidar
    .watch('./src/docs', { ignoreInitial: true })
    .on('all', async (event, path) => {
      console.log(event, path);
      await run(event, path);
    });
})();
