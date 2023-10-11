import * as fs from 'fs';
import yaml from 'js-yaml';

const errors = [];
const success = [];

const returnJSON = (filename) => {
  try {
    const doc = fs.readFileSync(`${filename}.yaml`, 'utf-8');
    const json = yaml.load(doc);

    fs.writeFileSync(`${filename}.json`, JSON.stringify(json));

    success.push(`Successfully created spec for ${filename}!`);
  } catch (error) {
    error.push(`creating spec for ${filename} failed: ${error}`);
  }
};

export const createSpecs = () => {
  returnJSON('./src/specs/chainweb/chainweb.openapi');
  returnJSON('./src/specs/pact/pact.openapi');

  return { success, errors };
};
