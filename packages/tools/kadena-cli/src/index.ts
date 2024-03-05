#!/usr/bin/env node
import { readStdin } from './utils/stdin.js';

async function main(): Promise<void> {
  // stdin must be read before the "commander" or "chalk" packages are loaded
  await readStdin();

  // Polyfill crypto for Node.JS <= 18.x
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).crypto = await import('crypto');

  const { Command } = await import('commander');
  const { loadProgram } = await import('./program.js');
  await loadProgram(new Command()).parseAsync();

  if (process.stderr.isTTY) {
    // Without this the stdin stream will not close on it's own
    const ttys = await import('ttys');
    ttys.stdin.destroy();
  }
}

// eslint-disable-next-line no-console
main().catch((error) => console.error(error));
