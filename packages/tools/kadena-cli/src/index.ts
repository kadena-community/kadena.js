#!/usr/bin/env node

import config from './config';
import contract from './contract';
import key from './key';
import tx from './tx';
import typescript from './typescript';

import { program } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson: { version: string } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
);

// TODO: introduce root flag --no-interactive
// TODO: introduce root flag --ci

[typescript, config, contract, tx, key].flat().forEach((fn) => {
  fn(program, packageJson.version);
});

program
  .description('CLI to interact with Kadena and its ecosystem')
  .version(packageJson.version)
  .parse();
