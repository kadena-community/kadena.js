import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { checkForHeaders } from './checkForHeaders.mjs';
import { copyFavIcons } from './copyFavIcons.mjs';
import { checkAuthors } from './createBlogAuthors.mjs';
import { createSitemap } from './createSitemap.mjs';
import { createSpecs } from './createSpec.mjs';
import { detectBrokenLinks } from './detectBrokenLinks.mjs';
import { createDocsTree } from './getdocstree.mjs';
import { deleteTempDir } from './importReadme/importRepo.mjs';
import { importAllReadmes } from './importReadme/index.mjs';
import { Spinner } from './spinner.mjs';

export const promiseExec = promisify(exec);
let globalError = false;

const createString = (str, start) => {
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

const runPrettier = async () => {
  const success = [];
  const errors = [];

  const { stderr } = await promiseExec(
    `prettier ./public/sitemap.xml --write && prettier ./src/pages --write  && prettier ./src/_generated/**/*.json --write`,
  );

  if (stderr) {
    errors.push(`Prettier had issues: ${sterr}`);
  } else {
    success.push('Prettier done!');
  }

  return { errors, success };
};

const initFunc = async (fnc, description) => {
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
    return (process.exitCode = 1);
  } else {
    success.map((succes) => {
      console.log(chalk.green('✓'), succes);
    });
  }

  console.log(createString(description));
};

(async function () {
  deleteTempDir();
  await initFunc(importAllReadmes, 'Import docs from monorepo');
  await initFunc(createDocsTree, 'Create docs tree');
  await initFunc(createSpecs, 'Create specs files');
  await initFunc(detectBrokenLinks, 'Detect broken links');
  await initFunc(checkForHeaders, 'Detect missing H1 headers');
  await initFunc(checkAuthors, 'Check author data for blog');
  await initFunc(createSitemap, 'Create the sitemap');
  await initFunc(copyFavIcons, 'Copy favicons');
  deleteTempDir();
  await initFunc(runPrettier, 'Prettier');

  if (globalError) {
    process.exitCode = 1;
  }
})();
