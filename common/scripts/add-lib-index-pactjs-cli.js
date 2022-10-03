#!/usr/bin/env node

const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { join, relative } = require('path');
const { stdout } = require('process');

const projectDir = join(__dirname, '../..');
const libPath = join(__dirname, '../..', 'packages/tools/pactjs-cli/lib');
const indexFilePath = join(libPath, 'index.js');

// create lib/ directory
if (!existsSync(libPath)) {
  stdout.write(`mkdir ./${relative(projectDir, libPath)}\n`);
  mkdirSync(libPath);
}

// create index.js
if (!existsSync(indexFilePath)) {
  stdout.write(`Creating file at ./${relative(projectDir, indexFilePath)}\n`);
  writeFileSync(
    indexFilePath,
    '// empty file to satisfy rush/pnpm linking binaries\n',
    'utf8',
  );
}

stdout.write(`Done!\n`);
