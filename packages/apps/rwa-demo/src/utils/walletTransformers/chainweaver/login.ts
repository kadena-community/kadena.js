import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import type { IState } from '@/components/TransactionsProvider/utils';
import { getWalletConnection } from '@/components/TransactionsProvider/utils';
import { WALLETTYPES } from '@/constants';
import { getPubkeyFromAccount } from '@/utils/getPubKey';

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
      publicKey: getPubkeyFromAccount(account),
      walletName: WALLETTYPES.CHAINWEAVER,
    })) ?? []
  );
};
