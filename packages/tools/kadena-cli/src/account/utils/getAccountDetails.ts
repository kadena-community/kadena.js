import { details } from '@kadena/client-utils/coin';
import { ChainId } from '@kadena/types';
import {
  IAccountDetailsResult,
  IAddAccountManualConfig,
  Predicate,
} from '../types.js';

export async function getAccountDetailsFromChain(
  config: IAddAccountManualConfig,
): Promise<IAccountDetailsResult> {
  const {
    accountName,
    chainId,
    networkConfig: { networkId, networkHost },
  } = config;
  try {
    const accountDetails = await details(
      accountName,
      networkId,
      chainId as ChainId,
      networkHost,
    );
    const { guard: { keys = [], pred } = {} } = accountDetails as {
      guard: { keys: string[]; pred: string };
    };

    return {
      publicKeys: keys,
      predicate: pred as Predicate,
    };
  } catch (e) {
    throw new Error(e.message);
  }
}
