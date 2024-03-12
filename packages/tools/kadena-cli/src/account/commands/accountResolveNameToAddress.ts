import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { kdnResolveNameToAddress } from '../utils/txKdnResolverChain.js';

export const resolveNameToAddress = async (
  name: string,
  network: 'testnet' | 'mainnet',
  networkId: string,
  networkHost: string,
): Promise<CommandResult<{ commands: string | undefined }>> => {
  try {
    const result = await kdnResolveNameToAddress(
      name,
      network,
      networkId,
      networkHost,
    );

    if (result === undefined) {
      return {
        success: false,
        errors: [`No address found for name: ${name}`],
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

export const createResolveNameToAddressCommand = createCommand(
  'name-to-address',
  'Resolve a .kda name to a k:address (kadenanames)',
  [
    globalOptions.network({ isOptional: false }),
    accountOptions.accountKdnName(),
  ],
  async (option) => {
    const kadena = await option.network({
      allowedNetworks: ['mainnet', 'testnet'],
    });
    const kadenaName = await option.accountKdnName();

    log.debug('resolve-address-to-name', {
      ...kadena,
      ...kadenaName,
    });

    const result = await resolveNameToAddress(
      kadenaName.accountKdnName,
      kadena.network as 'testnet' | 'mainnet',
      kadena.networkConfig.networkId,
      kadena.networkConfig.networkHost,
    );

    assertCommandError(result);

    log.info(log.color.green(`address: ${result.data.commands}`));
  },
);
