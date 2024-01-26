import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PROJECT_PATH = join(__dirname, '../../');

// modify package.json
const packageJsonPath = join(PROJECT_PATH, 'package.json');
copyFileSync('package.json', packageJsonPath);

// remove 'dependencies' 'devDependencies' and 'scripts' from bundle/package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
delete packageJson.dependencies;
delete packageJson.devDependencies;
delete packageJson.scripts;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
