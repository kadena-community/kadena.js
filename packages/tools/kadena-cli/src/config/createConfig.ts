/**
 * @module ConfigCreator
 * Handles configuration creation within different network context.
 */

import { writeConfig } from '../utils/globalConfig';

import { TOptions } from './initCommand';

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
): (args: TOptions) => Promise<void> {
  return async function action({
    publicKey,
    privateKey,
    chainId,
    network,
    networkId,
    networkHost,
    networkExplorerUrl,
    kadenaNamesApiEndpoint,
  }: TOptions) {
    return writeConfig({
      publicKey,
      privateKey,
      chainId,
      network,
      networkId,
      networkHost,
      networkExplorerUrl,
      kadenaNamesApiEndpoint,
    });
  };
}
