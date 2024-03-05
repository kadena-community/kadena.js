#!/usr/bin/env node
import { readStdin } from './utils/stdin.js';

async function main(): Promise<void> {
  // stdin must be read before the "commander" or "chalk" packages are loaded
  await readStdin();

  // Polyfill crypto for Node.JS <= 18.x
  const _global = globalThis as Record<string, unknown>;
  if (_global.crypto === undefined) _global.crypto = await import('crypto');

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
