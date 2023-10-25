#!/usr/bin/env node
import { accountCommandFactory } from './account/index.js';
import { configCommandFactory } from './config/index.js';
import { contractCommandFactory } from './contract/index.js';
// import { dappCommandFactory } from './dapp/index.js';
import { devnetCommandFactory } from './devnet/index.js';
import { keysCommandFactory } from './keys/index.js';
import { marmaladeCommandFactory } from './marmalade/index.js';
import { networksCommandFactory } from './networks/index.js';
import { txCommandFactory } from './tx/index.js';
import { typescriptCommandFactory } from './typescript/index.js';
import { clearCLI } from './utils/helpers.js';
import { program } from 'commander';
import { readFileSync } from 'node:fs';
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
// TODO: introduce root flag --no-interactive
// TODO: introduce root flag --ci
[
    configCommandFactory,
    networksCommandFactory,
    devnetCommandFactory,
    keysCommandFactory,
    accountCommandFactory,
    txCommandFactory,
    contractCommandFactory,
    marmaladeCommandFactory,
    typescriptCommandFactory,
    // dappCommandFactory,
]
    .flat()
    .forEach(async (fn) => {
    fn(program, packageJson.version);
});
clearCLI();
program
    .description('CLI to interact with Kadena and its ecosystem')
    .version(packageJson.version)
    .parse();
