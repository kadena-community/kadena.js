import { createSimpleSubCommand } from '../utils/helpers';

import { contextCommand } from './contextCommand';
import {
  configurationAction,
  currentContextAction,
  fullConfigurationAction,
  IConfigurationArgs,
  ICurrentContextArgs,
  IFullConfigurationArgs,
  IPrivateKeyArgs,
  IPublicKeyArgs,
  privateKeyAction,
  publicKeyAction,
} from './infoCommand';
import { initCommand } from './initCommand';

import { Command } from 'commander';

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

  initCommand(configProgram, version);
  contextCommand(configProgram, version);

  // Attach the subcommands to the configProgram
  createSimpleSubCommand<ICurrentContextArgs>(
    'currentContext',
    'display current Context',
    currentContextAction,
  )(configProgram);

  createSimpleSubCommand<IConfigurationArgs>(
    'currentConfig',
    'display current configuration for current context',
    configurationAction,
  )(configProgram);

  createSimpleSubCommand<IFullConfigurationArgs>(
    'fullConfig',
    'displays configuration for all contexts',
    fullConfigurationAction,
  )(configProgram);

  createSimpleSubCommand<IPublicKeyArgs>(
    'publicKey',
    'display Public Key',
    publicKeyAction,
  )(configProgram);

  createSimpleSubCommand<IPrivateKeyArgs>(
    'privateKey',
    'display Private Key',
    privateKeyAction,
  )(configProgram);
}
