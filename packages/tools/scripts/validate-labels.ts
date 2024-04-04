import yaml from 'js-yaml';
import fs from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Generate `packages.json` in root
// Usage: `npx tsx packages/tools/scripts/generate-packages-json.ts`

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

    if (!existingLabels[packageName]) {
      throw new Error(
        `One or more labels appear to be missing, please regenerate the labels by running "pnpm run format" from the root of the monorepo.`,
      );
    }
  }
};
main();
