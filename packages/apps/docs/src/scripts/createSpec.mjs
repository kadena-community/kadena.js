import * as fs from 'fs';
import yaml from 'js-yaml';

const returnJSON = (filename) => {
  const doc = fs.readFileSync(`./src/specs/${filename}.yaml`, 'utf-8');
  const json = yaml.load(doc);

  const DIR = './src/_generated/specs/';

  fs.mkdirSync(DIR, { recursive: true });

  fs.writeFileSync(`${DIR}${filename}.json`, JSON.stringify(json), {
    flag: 'w',
  });
};

returnJSON('chainweb.openapi');
returnJSON('pact.openapi');
