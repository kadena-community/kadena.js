import * as fs from 'fs';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Spinner } from './utils/spinner.mjs';
import { remark } from 'remark';
import { getSubDirLastModifiedDate } from './utils/getLastModifiedDate.mjs';

const promiseExec = promisify(exec);

const TEMPDIR = './.tempimport';
const DOCSROOT = './src/pages/docs';

const errors = [];

const createFrontMatter = (props) => {
  return `---\n${Object.keys(props)
    .map((prop) => `    ${prop}: "${props[prop]}", \n`)
    .join('')}
---
`;
};

const importDocs = async ({ filename, destination, tempDir }) => {
  const doc = fs.readFileSync(`${tempDir}/${filename}`, 'utf-8');

  const md = remark.parse(doc);

  console.log(md);
  const lastModifiedDate = await getSubDirLastModifiedDate(filename, tempDir);
  console.log(111, lastModifiedDate);

  fs.writeFileSync(
    `${DOCSROOT}/${destination}/index.md`,
    createFrontMatter({ title: 'sdf', lastModifiedDate }) + doc,
    {
      flag: 'w',
    },
  );
};

const getDirnameFromRepo = (repo) => {
  const arr = repo.split('/');
  const repoName = arr[arr.length - 1].split('.')[0];

  return repoName;
};

export const clone = async ({ filename, repo, destination }) => {
  fs.rmSync(TEMPDIR, { recursive: true, force: true });
  const repoName = getDirnameFromRepo(repo);
  await promiseExec(`git clone ${repo} ${TEMPDIR}/${repoName}`);

  importDocs({ filename, destination, tempDir: `${TEMPDIR}/${repoName}` });
};

const init = async () => {
  console.log(
    '============================================ START EXTERNAL IMPORT ==\n\n',
  );

  const spinner = Spinner();
  spinner.start();

  await clone({
    filename: `README.md`,
    repo: 'git@github.com:kadena-community/getting-started.git',
    destination: '/build/quickstart',
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
    '\n\n=============================================== END EXTERNAL IMPORT ====',
  );
};

init();
