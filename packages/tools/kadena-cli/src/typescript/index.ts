import { generateCommand } from './generate';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'typescript' = 'typescript';

export default [
  (program: Command, version: string) =>
    generateCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to generate and manage typescript definitions`),
      version,
    ),
];
