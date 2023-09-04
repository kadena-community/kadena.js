#!/usr/bin/env node

import typescript from './typescript';

import { program } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson: { version: string } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
);

typescript.forEach((fn) => {
  fn(program, packageJson.version);
});

program
  .description('CLI to interact with Kadena and its ecosystem')
  .version(packageJson.version)
  .parse();
