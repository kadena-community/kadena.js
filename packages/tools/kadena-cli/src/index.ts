#!/usr/bin/env node

import account from './account';
import config from './config';
import contract from './contract';
import devnet from './devnet';
import key from './key';
import marmalade from './marmalade';
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

[config, devnet, key, account, tx, contract, marmalade, typescript]
  .flat()
  .forEach((fn) => {
    fn(program, packageJson.version);
  });

program
  .description('CLI to interact with Kadena and its ecosystem')
  .version(packageJson.version)
  .parse();
