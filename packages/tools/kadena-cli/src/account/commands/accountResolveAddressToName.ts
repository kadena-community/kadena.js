import chalk from 'chalk';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { kdnResolveAddressToName } from '../utils/txKdnResolverChain.js';

export const resolveAddressToName = async (
  address: string,
  network: 'testnet' | 'mainnet',
  networkId: string,
  networkHost: string,
): Promise<CommandResult<{ commands: string | undefined }>> => {
  try {
    const result = await kdnResolveAddressToName(
      address,
      network,
      networkId,
      networkHost,
    );

    if (result === undefined) {
      return {
        success: false,
        errors: [`No name found for address: ${address}`],
      };
    }

    return { success: true, data: { commands: result } };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in name resolving action: ${error.message}`],
    };
  }
};

export const resolveAddressToNameCommand = createCommandFlexible(
  'resolve-address-to-name',
  'Resolve a k:address to a .kda name (kadenanames)',
  [globalOptions.network(), globalOptions.accountKdnAddress()],
  async (option) => {
    const kadena = await option.network({
      allowedNetworks: ['mainnet', 'testnet'],
    });
    const kadenaName = await option.accountKdnAddress();

    debug.log('resolve-address-to-name', {
      ...kadena,
      ...kadenaName,
    });

    const result = await resolveAddressToName(
      kadenaName.accountKdnAddress,
      kadena.network as 'testnet' | 'mainnet',
      kadena.networkConfig.networkId,
      kadena.networkConfig.networkHost,
    );

    assertCommandError(result);

    console.log(chalk.green(`name: ${result.data.commands}`));
  },
);
