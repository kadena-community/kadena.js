import fs from 'node:fs/promises';
import path from 'node:path';
import type { Project } from './types.js';

const DIRNAME = path.dirname(new URL(import.meta.url).pathname);
const ROOT_DIR = path.join(DIRNAME, '../../../..');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'packages/templates/package');
const RUSH_CONFIG_PATH = path.join(ROOT_DIR, 'rush.json');

export const deployPackage = async ({
  dir,
  name,
  description,
  repoUrl,
  type,
  shouldPublish,
}: Project) => {
  const targetDir = path.join(ROOT_DIR, dir);
  const manifestFilePath = path.join(targetDir, 'package.json');

  await fs.cp(TEMPLATE_DIR, targetDir, {
    recursive: true,
    filter: (src) => !/(.rush|node_modules|log|temp\/)/.test(src),
  });

  // Update package.json
  const pkg = JSON.parse(await fs.readFile(manifestFilePath, 'utf-8'));
  pkg.name = name;
  pkg.description = description;
  pkg.repository.url = repoUrl;
  pkg.repository.directory = dir;
  fs.writeFile(manifestFilePath, JSON.stringify(pkg, null, 2));

  // Update rush.json (using JSONC/JSON5.stringify by default does not preserve comments, not worth the efforts imho)
  const rushConfig = await fs.readFile(RUSH_CONFIG_PATH, 'utf-8');
  const project = {
    packageName: name,
    tags: [type],
    projectFolder: dir,
    shouldPublish: shouldPublish,
  };
  const config = rushConfig.replace(
    /("projects": \[)/,
    `$1${JSON.stringify(project)},`,
  );
  await fs.writeFile(RUSH_CONFIG_PATH, config);
};
