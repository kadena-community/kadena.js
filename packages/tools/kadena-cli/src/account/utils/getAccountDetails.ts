import { details } from '@kadena/client-utils/coin';
import type {
  IAccountConfig,
  IAccountDetailsResult,
  Predicate,
} from '../types.js';

interface IAccountDetails extends IAccountConfig {
  accountName: string;
}

interface IKeysGuard {
  keys: string[];
  pred: Predicate;
}

interface IAccountDetailsFromChain {
  guard: IKeysGuard;
}

export async function getAccountDetailsFromChain(
  config: IAccountDetails,
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
      chainId,
      networkHost,
    );

    if (accountDetails === undefined) {
      throw new Error(
        `Account details of ${accountName} does not exist on chain ${chainId}`,
      );
    }

    const {
      guard: { keys, pred },
    } = accountDetails as IAccountDetailsFromChain;

    return {
      publicKeys: keys,
      predicate: pred,
    };
  } catch (e) {
    throw new Error(e.message);
  }
}
