import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import type { IECKOWindow } from '@/components/EckoWalletConnect/eckotypes';
import { WALLETTYPES } from '@/constants';
import { env } from '@/utils/env';

export const eckoAccountLogin = async (): Promise<
  IWalletAccount | undefined
> => {
  const { kadena } = window as IECKOWindow;
  const isKadena = Boolean(kadena && kadena.isKadena);
  if (!isKadena) return;

  const result = await kadena.request({
    method: 'kda_connect',
    networkId: env.NETWORKID,
  });

  if (
    result.status === 'fail' ||
    !result.account.account ||
    !result.account.publicKey
  )
    return;

  return {
    address: result.account.account,
    publicKey: result.account.publicKey,
    guard: {
      keys: [result.account.publicKey],
      pred: 'keys-all',
    },
    keyset: {
      keys: [result.account.publicKey],
      pred: 'keys-all',
    },
    alias: 'Ecko Account',
    contract: '',
    chains: [],
    overallBalance: '0',
    walletName: WALLETTYPES.ECKO,
  };
};
