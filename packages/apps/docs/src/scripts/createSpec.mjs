import * as fs from 'fs';
import yaml from 'js-yaml';

const errors = [];
const success = [];

const returnJSON = (filename) => {
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

export const createSpecs = () => {
  returnJSON('chainweb.openapi');
  returnJSON('pact.openapi');

  return { success, errors };
};
