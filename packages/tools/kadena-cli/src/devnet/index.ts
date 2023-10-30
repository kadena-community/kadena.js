import { createSimpleSubCommand } from '../utils/helpers.js';

import { createDevnetsCommand } from './createDevnetsCommand.js';
import type { IListDevnetsArgs } from './listDevnetsCommand.js';
import { listDevnetsAction } from './listDevnetsCommand.js';
import { manageDevnets } from './manageDevnetsCommand.js';
import { runDevnetCommand } from './runDevnetCommand.js';

import type { Command } from 'commander';
import { removeDevnetCommand } from './removeDevnetCommand.js';
import { stopDevnetCommand } from './stopDevnetCommand.js';
import { updateDevnetCommand } from './updateDevnetCommand.js';

const SUBCOMMAND_ROOT: 'devnet' = 'devnet';

export function devnetCommandFactory(program: Command, version: string): void {
  const devnetsProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(
      `Tool for configuring, starting, stopping and managing local devnet containers`,
    );

  // Attach list subcommands to the devnetsProgram
  createSimpleSubCommand<IListDevnetsArgs>(
    'list',
    'List all available devnet container configurations',
    listDevnetsAction,
  )(devnetsProgram);

  manageDevnets(devnetsProgram, version);
  createDevnetsCommand(devnetsProgram, version);
  runDevnetCommand(devnetsProgram, version);
  stopDevnetCommand(devnetsProgram, version);
  removeDevnetCommand(devnetsProgram, version);
  updateDevnetCommand(devnetsProgram, version);
}
