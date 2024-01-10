import * as fs from 'fs';
import yaml from 'js-yaml';
import { clone } from './importReadme/index';
import type { IScriptResult } from './types';
import { TEMP_DIR } from './utils/build';

const errors: string[] = [];
const success: string[] = [];
const REPO = '/kadena-io/chainweb-openapi';

const returnJSON = (filename: string): void => {
  try {
    const doc = fs.readFileSync(`${TEMP_DIR}${REPO}/${filename}.yaml`, 'utf-8');
    const json = yaml.load(doc);

    const DIR = './src/_generated/specs/';

    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(`${DIR}${filename}.json`, JSON.stringify(json));

    success.push(`Successfully created spec for ${filename}!`);
  } catch (error) {
    errors.push(`creating spec for ${filename} failed: ${error}`);
  }
};

export const createSpecs = async (): Promise<IScriptResult> => {
  await clone(REPO);
  returnJSON('chainweb.openapi');
  returnJSON('pact.openapi');

  return { success, errors };
};
