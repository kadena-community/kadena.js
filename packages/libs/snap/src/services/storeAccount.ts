import { produce } from 'immer';
import { Account, ApiParams } from '../types';

export const storeAccount = async (
  snapApi: ApiParams,
  account: Account,
  type: 'default' | 'hardware',
): Promise<void> => {
  const newState = produce(snapApi.state, (draft) => {
    if (type === 'hardware') draft.hardwareAccounts.push(account);
    else draft.accounts.push(account);
  });

  await snapApi.wallet.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState,
    },
  });

  snapApi.state = newState;
};
