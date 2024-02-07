#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import ttys from 'ttys';

import { loadProgram } from './program.js';

async function main(): Promise<void> {
  let stdin: string = '';
  try {
    stdin = readFileSync(0, 'utf8');
  } catch (e) {
    /* empty */
  }

  process.argv.push(stdin);

  await loadProgram(new Command()).parseAsync();

  // Without this the stdin stream will not close on it's own
  ttys.stdin.destroy();
}

main().catch(console.error);
