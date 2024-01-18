import { checkForHeaders } from './checkForHeaders';
import { copyFavIcons } from './copyFavIcons';
import { checkAuthors } from './createBlogAuthors';
import { createSitemap } from './createSitemap';
import { createSpecs } from './createSpec';
import { detectBrokenLinks } from './detectBrokenLinks';
import { fixLocalLinks } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import { deleteTempDir } from './importReadme/importRepo';
import { movePages } from './movePages';
import type { IScriptResult } from './types';
import { initFunc, promiseExec } from './utils/build';
import { getGlobalError } from './utils/globalError';

const runPrettier = async (): Promise<IScriptResult> => {
  const success: string[] = [];
  const errors: string[] = [];

  const { stderr } = await promiseExec(
    `prettier ./public/sitemap.xml --write && prettier ./src/pages --write  && prettier ./src/_generated/**/*.json --write`,
  );

  if (stderr) {
    errors.push(`Prettier had issues: ${stderr}`);
  } else {
    success.push('Prettier done!');
  }

  return { errors, success };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function (): Promise<void> {
  //starting with a cleanslate, removing the tempdir.
  deleteTempDir();
  await initFunc(movePages, 'Move all pages from docs with config.yaml');
  await initFunc(fixLocalLinks, 'fix local links from the config.yaml');

  await initFunc(createDocsTree, 'Create docs tree');
  await initFunc(createSpecs, 'Create specs files');
  await initFunc(detectBrokenLinks, 'Detect broken links');
  await initFunc(checkForHeaders, 'Detect missing H1 headers');
  await initFunc(checkAuthors, 'Check author data for blog');
  await initFunc(createSitemap, 'Create the sitemap');
  await initFunc(copyFavIcons, 'Copy favicons');
  await initFunc(runPrettier, 'Prettier');
  //cleanup, removing the tempdir
  deleteTempDir();

  if (getGlobalError() && process.env.NODE_ENV !== 'development') {
    process.exitCode = 1;
  }
})();
