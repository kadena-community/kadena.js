import { createDevnetCommand } from './createDevnetCommand.js';
import { deleteDevnetCommand } from './deleteDevnetCommand.js';
import { listDevnetsCommand } from './listDevnetsCommand.js';
import { manageDevnetsCommand } from './manageDevnetsCommand.js';
import { runDevnetCommand } from './runDevnetCommand.js';
import { stopDevnetCommand } from './stopDevnetCommand.js';
import { updateDevnetCommand } from './updateDevnetCommand.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'devnet' = 'devnet';

export function devnetsCommandFactory(
  program: Command,
  version: string,
): void {
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
}
