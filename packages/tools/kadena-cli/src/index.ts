#!/usr/bin/env node
import { readStdin } from './utils/stdin.js';

async function main(): Promise<void> {
  // stdin must be read before the "commander" package is loaded
  await readStdin();

  const { Command } = await import('commander');
  const { loadProgram } = await import('./program.js');
  await loadProgram(new Command()).parseAsync();

  if (process.stderr.isTTY) {
    // Without this the stdin stream will not close on it's own
    const ttys = await import('ttys');
    ttys.stdin.destroy();
  }
}

main().catch(console.error);
