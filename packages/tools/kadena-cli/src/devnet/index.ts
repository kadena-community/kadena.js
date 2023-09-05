import { startCommand } from './start';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'devnet' = 'devnet';

export function devnetCommandFactory(program: Command, version: string) {}

export default [
  (program: Command, version: string) =>
    startCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(
          `Tool for starting, stopping and managing the local devnet`,
        ),
      version,
    ),
];
