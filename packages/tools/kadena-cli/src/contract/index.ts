import { retrieveCommand } from './retrieve';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'contract' = 'contract';

export default [
  (program: Command, version: string) =>
    retrieveCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for managing smart-contracts`),
      version,
    ),
];
