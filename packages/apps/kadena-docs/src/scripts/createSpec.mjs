import * as fs from 'fs';
import yaml from 'js-yaml';

const returnJSON = (filename) => {
  const doc = fs.readFileSync(`${filename}`, 'utf-8');
  return yaml.load(doc);
};

const json = returnJSON('./src/specs/chainweb/chainweb.openapi.yaml');
fs.writeFileSync(
  './src/specs/chainweb/chainweb.openapi.json',
  JSON.stringify(json),
);
console.log(json);
