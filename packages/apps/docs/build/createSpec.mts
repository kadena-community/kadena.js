import * as fs from 'fs';
import yaml from 'js-yaml';
import { BuildReturn, ErrorsReturn, SucccessReturn } from './types.mjs';

const errors: ErrorsReturn = [];
const success: SucccessReturn = [];

const returnJSON = (filename: string): void => {
  try {
    const doc = fs.readFileSync(`./src/specs/${filename}.yaml`, 'utf-8');
    const json = yaml.load(doc);

    const DIR = './src/_generated/specs/';

    fs.mkdirSync(DIR, { recursive: true });
    console.log(`${DIR}${filename}.json`);
    fs.writeFileSync(`${DIR}${filename}.json`, JSON.stringify(json));

    success.push(`Successfully created spec for ${filename}!`);
  } catch (error) {
    errors.push(`creating spec for ${filename} failed: ${error}`);
  }
};

export const createSpecs = async (): Promise<BuildReturn> => {
  returnJSON('chainweb.openapi');
  returnJSON('pact.openapi');

  return { success, errors };
};
