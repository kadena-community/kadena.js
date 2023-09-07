#!/usr/bin/env node
import { accountCommandFactory } from './account';
import { configCommandFactory } from './config';
import { contractCommandFactory } from './contract';
import { devnetCommandFactory } from './devnet';
import { keyCommandFactory } from './key';
import { marmaladeCommandFactory } from './marmalade';
import { txCommandFactory } from './tx';
import { typescriptCommandFactory } from './typescript';

import clear from 'clear';
import { program } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson: { version: string } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
);

// TODO: introduce root flag --no-interactive
// TODO: introduce root flag --ci

[
  configCommandFactory,
  devnetCommandFactory,
  keyCommandFactory,
  accountCommandFactory,
  txCommandFactory,
  contractCommandFactory,
  marmaladeCommandFactory,
  typescriptCommandFactory,
]
  .flat()
  .forEach((fn) => {
    fn(program, packageJson.version);
  });

clear();

program
  .description('CLI to interact with Kadena and its ecosystem')
  .version(packageJson.version)
  .parse();
