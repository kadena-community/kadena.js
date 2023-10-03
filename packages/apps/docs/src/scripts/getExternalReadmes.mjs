import * as fs from 'fs';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Spinner } from './utils/spinner.mjs';
import { remark } from 'remark';
import { getSubDirLastModifiedDate } from './utils/getLastModifiedDate.mjs';
import { getTitle } from './utils/markdownUtils.mjs';

const promiseExec = promisify(exec);

const TEMPDIR = './.tempimport';
const DOCSROOT = './src/pages/docs';
const REPOPREFIX = 'https://github.com/';
const REPOURLPREFIX = 'https://github.com';

const errors = [];

const createFrontMatter = (props) => {
  return `---\n${Object.keys(props)
    .map((prop) => `${prop}: ${props[prop]}\n`)
    .join('')}
---
`;
};

const createEditOverwrite = (repo, filename) => {
  return `${REPOURLPREFIX}/${repo}/blob/main/${filename}`;
};

const importDocs = async ({
  filename,
  destination,
  tempDir,
  repo,
  options,
}) => {
  const doc = fs.readFileSync(`${tempDir}/${filename}`, 'utf-8');

  const md = remark.parse(doc);

  const lastModifiedDate = await getSubDirLastModifiedDate(filename, tempDir);

  const title = getTitle(md);
  const index = 1;

  fs.writeFileSync(
    `${DOCSROOT}/${destination}/index.md`,
    createFrontMatter({
      title,
      label: title,
      menu: 'Quickstart',
      layout: 'full',
      index,
      lastModifiedDate,
      editLink: createEditOverwrite(repo, filename),
      tags: options.tags,
    }) + doc,
    {
      flag: 'w',
    },
  );
};

const getDirnameFromRepo = (repo) => {
  const arr = repo.split('/');
  const repoName = arr[arr.length - 1];

  return repoName;
};

export const clone = async ({ filename, repo, destination, options }) => {
  fs.rmSync(TEMPDIR, { recursive: true, force: true });
  const repoName = getDirnameFromRepo(repo);
  await promiseExec(`git clone ${REPOPREFIX}${repo} ${TEMPDIR}/${repoName}`);

  importDocs({
    filename,
    destination,
    repo,
    tempDir: `${TEMPDIR}/${repoName}`,
    options,
  });
};

const init = async () => {
  console.log(
    '========================================= START EXTERNAL IMPORT ==\n\n',
  );

  const spinner = Spinner();
  spinner.start();

  await clone({
    filename: `README.md`,
    repo: 'kadena-community/getting-started',
    destination: '/build/quickstart',
    options: {
      order: 0,
      tags: ['devnet', 'chainweaver', 'tutorial', 'docker', 'transactions'],
    },
  });

  spinner.stop();

  if (errors.length) {
    errors.map((error) => {
      console.warn(chalk.red('⨯'), error);
    });
    process.exitCode = 1;
  } else {
    console.log(chalk.green('✓'), 'EXTERNAL IMPORT DONE');
  }
  console.log(
    '\n\n============================================ END EXTERNAL IMPORT ====',
  );
};

init();
