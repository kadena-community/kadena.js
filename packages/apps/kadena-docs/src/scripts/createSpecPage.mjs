import fs from 'fs';
import yaml from 'js-yaml';
import widdershins from 'widdershins';

const createSpecPage = (filename) => {
  const contentYml = fs.readFileSync(filename, 'utf8');
  const doc = yaml.load(contentYml);

  const options = {};

  console.log(filename);
  widdershins
    .convert(doc, options)
    .then((markdownOutput) => {
      fs.writeFileSync(
        `./src/pages/docs/chainweb/openapi.mdx`,
        markdownOutput,
        {
          flag: 'w',
        },
      );
    })
    .catch((err) => {
      console.log({ err });
      // handle errors
    });
};

createSpecPage('./src/specs/chainweb/chainweb.openapi.yaml');
