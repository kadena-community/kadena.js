import {
  Account,
  AddHardwareAccountRequestParams,
  ApiParams,
  DerivedAccount,
} from '../types';
import { makeValidator } from '../utils/validate';
import { getKeyDeriver, getAccountsFromIndex } from '../utils/kadenaUtils';
import { storeAccount } from './storeAccount';
import { nanoid } from 'nanoid';

/**
 * Derive an account from the Kadena snap.
 * @param requestParams
 * @returns The name, address, public key, and index of the derived account.
 */
export async function addAccount(snapApi: ApiParams): Promise<Account> {
  const index = getNextIndex(snapApi);

  const derivedAccount = await derive(index);

  const account: Account = {
    id: nanoid(),
    index: index,
    address: derivedAccount.address,
    name: derivedAccount.name,
    publicKey: derivedAccount.publicKey,
  };

  await storeAccount(snapApi, account, 'default');

  return account;
}

export async function derive(index: number): Promise<DerivedAccount> {
  const keyDeriver = await getKeyDeriver();
  const derivedAccount = await getAccountsFromIndex(keyDeriver, index);
  return derivedAccount;
}

const validateParams = makeValidator({
  index: 'number',
  address: 'string',
  publicKey: 'string',
});

export async function addHardwareAccount(snapApi: ApiParams): Promise<Account> {
  validateParams(snapApi.requestParams);

  const { address, publicKey, index } =
    snapApi.requestParams as AddHardwareAccountRequestParams;

  const account: Account = {
    id: nanoid(),
    index: index,
    address: address.replace(/^0x/, 'k:'),
    name: `Ledger Account ${index + 1}`,
    publicKey: publicKey,
  };

  await storeAccount(snapApi, account, 'hardware');

  return account;
}

const getNextIndex = (snapApi: ApiParams) => {
  const indices = snapApi.state.accounts
    .map((account) => account.index)
    .sort((a, b) => a - b);

  let index = 0;
  for (const current of indices) {
    if (current !== index) break;
    index++;
  }

  return index;
};
