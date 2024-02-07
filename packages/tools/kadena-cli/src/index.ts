#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';

import { loadProgram } from './program.js';

async function main(): Promise<void> {
  if (!process.stderr.isTTY) {
    await loadProgram(new Command()).parseAsync();
    return;
  }

  const ttys = await import('ttys');
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
