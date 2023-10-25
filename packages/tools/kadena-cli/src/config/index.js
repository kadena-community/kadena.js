import { createSimpleSubCommand } from '../utils/helpers.js';
import { showConfigurationAction } from './infoCommand.js';
import { initCommand } from './initConfigCommand.js';
import { Option } from 'commander';
/**
 * Represents the root command for the configuration CLI.
 * @type {string}
 */
const SUBCOMMAND_ROOT = 'config';
/**
 * Factory function to generate a configuration command with subcommands.
 *
 * @param {Command} program - The commander program object.
 * @param {string} version - The version of the CLI.
 */
export function configCommandFactory(program, version) {
    const configProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for setting up and managing the CLI configuration and contexts`);
    // create project configuration
    initCommand(configProgram, version);
    // show configuration
    createSimpleSubCommand('show', 'displays configuration ', showConfigurationAction, [new Option('-p, --projectName <projectName>', 'Name of project')])(configProgram);
}
