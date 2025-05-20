import type { IECKOWindow } from '@/components/EckoWalletConnect/eckotypes';
import { WALLETTYPES } from '@/constants';
import type {
  Guard,
  IWalletAccount,
} from '@/providers/AccountProvider/AccountType';
import { getKeysetService } from '@/services/getKeyset';
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

  const keyset = (await getKeysetService(result.account.account)) as Guard;

  return {
    address: result.account.account,
    publicKey: result.account.publicKey,
    guard: keyset,
    keyset: keyset,
    alias: 'Ecko Account',
    contract: '',
    chains: [],
    overallBalance: '0',
    walletName: WALLETTYPES.ECKO,
  };
};
