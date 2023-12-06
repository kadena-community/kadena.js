import * as fs from 'fs';
import yaml from 'js-yaml';
import { TEMPDIR } from './importReadme/createDoc.mjs';
import { clone } from './importReadme/index.mjs';

const errors = [];
const success = [];
const REPO = '/kadena-io/chainweb-openapi';

const returnJSON = (filename) => {
  try {
    const doc = fs.readFileSync(`${TEMPDIR}${REPO}/${filename}.yaml`, 'utf-8');
    const json = yaml.load(doc);

    const DIR = './src/_generated/specs/';

    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(`${DIR}${filename}.json`, JSON.stringify(json));

    success.push(`Successfully created spec for ${filename}!`);
  } catch (error) {
    errors.push(`creating spec for ${filename} failed: ${error}`);
  }
};

export const createSpecs = async () => {
  await clone(REPO);
  returnJSON('chainweb.openapi');
  returnJSON('pact.openapi');

  return { success, errors };
};
