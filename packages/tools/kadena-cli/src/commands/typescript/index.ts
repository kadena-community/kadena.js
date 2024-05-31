import { typescriptGenerateCommand } from './commands/typescriptGenerateCommand.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'typescript' = 'typescript';

export function typescriptCommandFactory(
  program: Command,
  version: string,
): void {
  const typescriptProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage typescript definitions`);

  typescriptGenerateCommand(typescriptProgram, version);
}
