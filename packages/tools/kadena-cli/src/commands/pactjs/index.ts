import type { Command } from 'commander';
import { createContractGenerateCommand } from './commands/contractGenerate.js';
import { createRetrieveContractCommand } from './commands/retrieveContract.js';
import { createTemplateGenerateCommand } from './commands/templateGenerate.js';

const SUBCOMMAND_ROOT: 'pactjs' = 'pactjs';

export function pactjsCommandFactory(program: Command, version: string): void {
  const pactjsProgram = program
    .command(SUBCOMMAND_ROOT)
    .description('Tool to generate and manage PactJS related tasks');

  createContractGenerateCommand(pactjsProgram, version);
  createRetrieveContractCommand(pactjsProgram, version);
  createTemplateGenerateCommand(pactjsProgram, version);
}
