import * as fs from 'fs';
import yaml from 'js-yaml';

const returnJSON = (filename) => {
  const doc = fs.readFileSync(`${filename}.yaml`, 'utf-8');
  const json = yaml.load(doc);

  fs.writeFileSync(`${filename}.json`, JSON.stringify(json));
};

returnJSON('./src/specs/chainweb/chainweb.openapi');
returnJSON('./src/specs/pact/pact.openapi');
