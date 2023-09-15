/**
 * @module ConfigCreator
 * Handles configuration creation within different network context.
 */

import { writeConfig } from '../utils/globalConfig';

import { TConfigOptions } from './configOptions';

import { Command } from 'commander';

/**
 * Generates a configuration function for a given network.
 * @param {Command} __program - The commander program instance.
 * @param {string} __version - The version string.
 * @returns {Function} - The configuration function for the given options.
 */
export function createConfig(
  __program: Command,
  __version: string,
): (args: TConfigOptions) => void {
  return function action({
    context,
    publicKey,
    privateKey,
    chainId,
    networkId,
    networkHost,
    networkExplorerUrl,
    kadenaNamesApiEndpoint,
  }: TConfigOptions) {
    return writeConfig({
      context,
      publicKey,
      privateKey,
      chainId,
      networkId,
      networkHost,
      networkExplorerUrl,
      kadenaNamesApiEndpoint,
    });
  };
}
