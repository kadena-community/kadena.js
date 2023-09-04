import { generate } from './generate';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'key' = 'key';

export default [
  (program: Command, version: string) =>
    generate(
      program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to generate and manage keys`),
      version,
    ),
];
