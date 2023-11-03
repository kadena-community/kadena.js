import { initCommand } from './initConfigCommand.js';
import type { Command } from 'commander';

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
      `Tool for setting up the Kadena CLI configuration`,
    );

  // create project configuration
  initCommand(configProgram, version);
}
