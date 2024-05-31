import { createDevnetCommand } from './commands/devnetCreate.js';
import { deleteDevnetCommand } from './commands/devnetDelete.js';
import { listDevnetsCommand } from './commands/devnetList.js';
import { manageDevnetsCommand } from './commands/devnetManage.js';
import { runDevnetCommand } from './commands/devnetRun.js';
import { simulateCommand } from './commands/devnetSimulation.js';
import { stopDevnetCommand } from './commands/devnetStop.js';
import { updateDevnetCommand } from './commands/devnetUpdate.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'devnet' = 'devnet';

export function devnetCommandFactory(program: Command, version: string): void {
  const devnetsProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to create and manage devnets`);

  listDevnetsCommand(devnetsProgram, version);
  manageDevnetsCommand(devnetsProgram, version);
  createDevnetCommand(devnetsProgram, version);
  deleteDevnetCommand(devnetsProgram, version);
  runDevnetCommand(devnetsProgram, version);
  stopDevnetCommand(devnetsProgram, version);
  updateDevnetCommand(devnetsProgram, version);
  simulateCommand(devnetsProgram, version);
}
