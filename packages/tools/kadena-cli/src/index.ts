#!/usr/bin/env node
import crypto from 'crypto';
import { readStdin } from './utils/stdin.js';

/** mock for navigator which a dependency includes in the rollup bundle */
if (globalThis.navigator === undefined) globalThis.navigator = {} as Navigator;
// Polyfill crypto for Node.JS <= 18.x
const _global = globalThis as Record<string, unknown>;
if (_global.crypto === undefined) _global.crypto = crypto;

async function main(): Promise<void> {
  // stdin must be read before the "commander" or "chalk" packages are loaded
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

// eslint-disable-next-line no-console
main().catch((error) => console.error(error));
