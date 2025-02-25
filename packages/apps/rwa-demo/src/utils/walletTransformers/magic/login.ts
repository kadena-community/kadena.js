import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import type { IECKOWindow } from '@/components/EckoWalletConnect/eckotypes';
import { WALLETTYPES } from '@/constants';
import { env } from '@/utils/env';
import { KadenaExtension } from '@magic-ext/kadena';
import { Magic } from 'magic-sdk';

export const magicAccountLogin = async (): Promise<
  IWalletAccount | undefined
> => {
  const magic = new Magic(env.MAGIC_APIKEY, {
    extensions: [
      new KadenaExtension({
        rpcUrl: env.CHAINWEBAPIURL,
        chainId: env.CHAINID,
        networkId: env.NETWORKID,
        createAccountsOnChain: true,
      }),
    ],
  });

  const account = await magic.kadena.loginWithSpireKey();

  return {
    address: account.accountName,
    publicKey: account.devices[0].guard.keys[0],
    guard: account.guard,
    alias: account.alias,
    contract: '',
    chains: account.chainIds,
    overallBalance: account.balance,
    walletName: WALLETTYPES.MAGIC,
    walletType: 'WebAuthn',
  };
};
