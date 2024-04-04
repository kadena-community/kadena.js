import yaml from 'js-yaml';
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Generate labels in `.github/labeler.yml`
// Usage: `npx tsx packages/tools/scripts/generate-labels.ts`

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, '../../..');

const packageJsonPath = `${baseDir}/packages.json`;
const labelerYmlPath = `${baseDir}/.github/labeler.yml`;

const main = async () => {
  // Read the package.json file
  const packages = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const existingLabels =
    yaml.load(await fs.readFile(labelerYmlPath, 'utf8')) || {};

  for (const pkg of packages) {
    const packageName = pkg.name.split('/').pop();
    const packagePath = pkg.path;

    // Check if the package is already present in the labels
    if (!existingLabels[packageName]) {
      const options = {
        [packageName]: [
          {
            'changed-files': [
              {
                'any-glob-to-any-file': `${packagePath}/*`,
              },
            ],
          },
        ],
      };
      existingLabels[packageName] = options[packageName];
    }
  }

  const yamlString = yaml.dump(existingLabels);
  await fs.writeFile(labelerYmlPath, yamlString, 'utf8');
};
main();
