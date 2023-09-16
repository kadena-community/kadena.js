import { sendCommand } from './send';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

export function txCommandFactory(program: Command, version: string): void {
  const txProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for creating and managing transactions`);

  sendCommand(txProgram, version);
}
