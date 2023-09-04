import { sendCommand } from './send';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

export default [
  (program: Command, version: string) =>
    sendCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for creating and managing transactions`),
      version,
    ),
];
