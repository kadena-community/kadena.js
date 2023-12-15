import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { checkForHeaders } from './checkForHeaders';
import { copyFavIcons } from './copyFavIcons';
import { checkAuthors } from './createBlogAuthors';
import { createSitemap } from './createSitemap';
import { createSpecs } from './createSpec';
import { detectBrokenLinks } from './detectBrokenLinks';
import { fixLocalLinks } from './fixLocalLinks';
import { createDocsTree } from './getdocstree';
import { importAllReadmes } from './importReadme';
import { deleteTempDir } from './importReadme/importRepo';
import { movePages } from './movePages';
import { Spinner } from './spinner';
import type { IScriptResult } from './types';

export const promiseExec = promisify(exec);
let globalError = false;

const createString = (str: string, start?: boolean): string => {
  let titleStr = ` END ${chalk.blue(str.toUpperCase())} ====`;
  let line = '\n\n';
  if (start) {
    titleStr = ` START ${chalk.blue(str.toUpperCase())} ====\n\n`;
    line = '';
  }
  const maxLineLength = 70;

  while (line.length + titleStr.length < maxLineLength) {
    line += `=`;
  }

  return `${line}${titleStr}`;
};

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

const initFunc = async (
  fnc: () => Promise<IScriptResult>,
  description: string,
): Promise<void | number> => {
  console.log(createString(description, true));

  const spinner = Spinner();
  spinner.start();

  const { success, errors } = await fnc();

  spinner.stop();

  if (errors.length) {
    errors.map((error) => {
      console.warn(chalk.red('⨯'), error);
    });
    globalError = true;
    return;
  } else {
    success.map((succes) => {
      console.log(chalk.green('✓'), succes);
    });
  }

  console.log(createString(description));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function (): Promise<void> {
  //starting with a cleanslate, removing the tempdir.
  deleteTempDir();
  await initFunc(movePages, 'create foldertree from config.yaml');
  await initFunc(fixLocalLinks, 'fix local links from the config.yaml');

  await initFunc(importAllReadmes, 'Import docs from monorepo');
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

  if (globalError) {
    process.exitCode = 1;
  }
})();
