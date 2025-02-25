import type {
  Guard,
  IWalletAccount,
} from '@/components/AccountProvider/AccountType';
import { WALLETTYPES } from '@/constants';
import type { KadenaExtension } from '@magic-ext/kadena';
import { magicInit } from './utils';

export const magicAccountLogin = async (): Promise<
  IWalletAccount | undefined
> => {
  const magic = magicInit();

  const account = await (magic.kadena as KadenaExtension).loginWithSpireKey();

  console.log({ account });
  return {
    address: account.accountName,
    publicKey: account.devices[0].guard.keys[0],
    guard: account.guard as Guard,
    alias: account.alias,
    contract: '',
    chains: account.chainIds.map((chainId) => ({ chainId, balance: '0' })),
    overallBalance: account.balance,
    walletName: WALLETTYPES.MAGIC,
    walletType: 'WebAuthn',
  };
};
