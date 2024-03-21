import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
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
        status: 'error',
        errors: [`No name found for address: ${address}`],
      };
    }

    return { status: 'success', data: { commands: result } };
  } catch (error) {
    return {
      status: 'error',
      errors: [`Error in name resolving action: ${error.message}`],
    };
  }
};

export const createResolveAddressToNameCommand = createCommand(
  'address-to-name',
  'Resolve a k:address to a .kda name (kadenanames)',
  [
    globalOptions.network({ isOptional: false }),
    accountOptions.accountKdnAddress(),
  ],
  async (option) => {
    const kadena = await option.network({
      allowedNetworks: ['mainnet', 'testnet'],
    });
    const kadenaName = await option.accountKdnAddress();

    log.debug('resolve-address-to-name', {
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

    log.info(log.color.green(`name: ${result.data.commands}`));
  },
);
