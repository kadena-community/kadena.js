import type {
  IWalletAccount,
  KeysetGuard,
} from '@/components/AccountProvider/AccountType';
import type { IState } from '@/components/TransactionsProvider/utils';
import { getWalletConnection } from '@/components/TransactionsProvider/utils';
import { WALLETTYPES } from '@/constants';

export const chainweaverAccountLogin = async (): Promise<IWalletAccount[]> => {
  const { message, focus, close } = await getWalletConnection();
  focus();
  const response = await message('CONNECTION_REQUEST', {
    name: 'RWA-demo',
  });

  if ((response.payload as any).status !== 'accepted') {
    return [];
  }
  const { payload } = (await message('GET_STATUS', {
    name: 'RWA-demo',
  })) as { payload: IState };

  close();

  return (
    payload.accounts.map((account) => ({
      ...account,
      publicKey: (account.guard as KeysetGuard).keys[0],
      keyset: account.guard,
      walletName: WALLETTYPES.CHAINWEAVER,
    })) ?? []
  );
};
