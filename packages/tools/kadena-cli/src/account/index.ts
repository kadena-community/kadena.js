import { fundCommand } from './fund';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'account' = 'account';

export default [
  (program: Command, version: string) =>
    fundCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to manage accounts of fungibles (e.g. 'coin')`),
      version,
    ),
];
