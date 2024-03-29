import { createConfigInitCommand } from './commands/configInit.js';

import type { Command } from 'commander';
import { createConfigPathCommand } from './commands/configPath.js';

/**
 * Represents the root command for the configuration CLI.
 * @type {string}
 */
const SUBCOMMAND_ROOT: 'config' = 'config';

/**
 * Factory function to generate a configuration command with subcommands.
 *
 * @param {Command} program - The commander program object.
 * @param {string} version - The version of the CLI.
 */
export function configCommandFactory(program: Command, version: string): void {
  const configProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(
      `Tool for setting up and managing the CLI configuration and contexts`,
    );

  /* Create project configuration
      all projects bootstrap comes from this configuration
  */
  createConfigInitCommand(configProgram, version);
  createConfigPathCommand(configProgram, version);
}
