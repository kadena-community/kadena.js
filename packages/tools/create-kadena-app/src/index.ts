#!/usr/bin/env node
import { projectGenerateCommand } from './generate-project/index.js';

import { program } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename);

const packageJson: { version: string } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
);

projectGenerateCommand(program, packageJson.version, __dirname);

program
  .name('create-kadena-app')
  .description(
    'create-kadena-app cli to create a starter project with @kadena/client integration',
  )
  .version(packageJson.version)
  .parse();
