import { exec } from 'child_process';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { promisify } from 'util';
import { deleteTempDir, TEMPDIR } from './importReadme/importRepo.mjs';

const errors = [];
const success = [];
const REPO = '/kadena-io/chainweb-openapi';

const promiseExec = promisify(exec);

/**
 * @param {ImportItem} importItem
 */
const clone = async () => {
  await promiseExec(`git clone https://github.com${REPO} ${TEMPDIR}${REPO}`);
};

const returnJSON = (filename) => {
  try {
    const doc = fs.readFileSync(`${TEMPDIR}${REPO}/${filename}.yaml`, 'utf-8');
    const json = yaml.load(doc);

    const DIR = './src/_generated/specs/';

    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(`${DIR}${filename}.json`, JSON.stringify(json));

    success.push(`Successfully created spec for ${filename}!`);
  } catch (error) {
    deleteTempDir();
    errors.push(`creating spec for ${filename} failed: ${error}`);
  }
};

export const createSpecs = async () => {
  await clone();
  returnJSON('chainweb.openapi');
  returnJSON('pact.openapi');

  deleteTempDir();
  return { success, errors };
};
