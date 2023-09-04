import { mintCommand } from './mint';

import { Command } from 'commander';

const SUBCOMMAND_ROOT: 'marmalade' = 'marmalade';

export default [
  (program: Command, version: string) =>
    mintCommand(
      program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for minting and managing NFTs with Marmalade`),
      version,
    ),
];
