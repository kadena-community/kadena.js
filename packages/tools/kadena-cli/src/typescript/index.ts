import { contractGenerateCommand } from './generate';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'typescript' = 'typescript';

export default [
  (program: Command, version: string) =>
    contractGenerateCommand(program.command(SUBCOMMAND_ROOT), version),
];
