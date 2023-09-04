import { initCommand } from './init';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'config' = 'config';

export default [
  (program: Command, version: string) =>
    initCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(
          `Tool for setting up and managing te CLI configuration and contexts`,
        ),
      version,
    ),
];
