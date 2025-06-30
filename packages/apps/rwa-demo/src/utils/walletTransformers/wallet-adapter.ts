import type { WALLETTYPES } from '@/constants';
import type {
  Guard,
  IWalletAccount,
} from '@/providers/AccountProvider/AccountType';
import type { ChainId } from '@kadena/client';
import type { IAccountInfo } from '@kadena/wallet-adapter-core';

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function mapWalletAdapterAccount(
  adapterAccount: IAccountInfo,
  walletName: (typeof WALLETTYPES)[keyof typeof WALLETTYPES],
): IWalletAccount {
  console.log('map wallet account', walletName, adapterAccount);
  const account: IWalletAccount = {
    address: adapterAccount.accountName,
    publicKey: adapterAccount.keyset.keys[0],
    guard: adapterAccount.keyset as Guard,
    keyset: adapterAccount.keyset as Guard,
    alias:
      adapterAccount.label ?? `${capitalizeFirstLetter(walletName)} Account`,
    contract: adapterAccount.contract ?? 'coin',
    chains: adapterAccount.existsOnChains.map((chain) => ({
      chainId: chain as ChainId,
      balance: '0',
    })),
    overallBalance: '0',
    walletName,
  };
  return account;
}
