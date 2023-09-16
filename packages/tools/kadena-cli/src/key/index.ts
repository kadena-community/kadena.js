import { generate } from './generate';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'key' = 'key';

export function keyCommandFactory(program: Command, version: string): void {
  const keyProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);

  generate(keyProgram, version);
}
