import { startCommand } from './start';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'devnet' = 'devnet';

export function devnetCommandFactory(program: Command, version: string): void {
  const devnetProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for starting, stopping and managing the local devnet`);

  startCommand(devnetProgram, version);
}
