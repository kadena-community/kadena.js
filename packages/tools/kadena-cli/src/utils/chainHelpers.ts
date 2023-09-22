import type { ChainId, ICommandResult } from '@kadena/client';
import { Pact } from '@kadena/client';

import { dirtyRead } from './client';

/**
 * Fetches the balance of the given account on a specific chain and network.
 *
 * @param {string} accountName - The name of the account to fetch the balance for.
 * @param {ChainId} chainId - The chain ID to fetch the balance from.
 * @param {string} networkId - The network ID to fetch the balance from.
 * @returns {Promise<ICommandResult>} - The result of the command.
 */
export function getBalance(
  accountName: string,
  chainId: ChainId,
  networkId: string,
): Promise<ICommandResult> {
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](accountName))
    .setMeta({ chainId })
    .setNetworkId(networkId)
    .createTransaction();

  return dirtyRead(transaction);
}

/**
 * Checks if a given account exists on a specific chain and network.
 *
 * @param {string} accountName - The name of the account to check for existence.
 * @param {ChainId} chainId - The chain ID to check on.
 * @param {string} networkId - The network ID to check on.
 * @returns {Promise<boolean>} - True if the account exists, false otherwise.
 */
export async function accountExists(
  accountName: string,
  chainId: ChainId,
  networkId: string,
): Promise<boolean> {
  const { result } = await getBalance(accountName, chainId, networkId);
  return !(
    result.status === 'failure' &&
    (result.error as { message: string }).message.includes('row not found')
  );
}
