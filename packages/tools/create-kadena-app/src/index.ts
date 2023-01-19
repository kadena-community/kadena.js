#!/usr/bin/env node
import { projectGenerateCommand } from './generate-project';

import { program } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

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
