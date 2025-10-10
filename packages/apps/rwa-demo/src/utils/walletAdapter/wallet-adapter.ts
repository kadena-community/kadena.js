import { WALLETTYPES } from '@/constants';
import type {
  Guard,
  IWalletAccount,
} from '@/providers/AccountProvider/AccountType';
import type { ChainId } from '@kadena/client';
import { CHAINWEAVER_ADAPTER } from '@kadena/wallet-adapter-chainweaver';
import type { IAccountInfo } from '@kadena/wallet-adapter-core';
import { ECKO_ADAPTER } from '@kadena/wallet-adapter-ecko';
import { MAGIC_ADAPTER } from '@kadena/wallet-adapter-magic';
import { WALLET_CONNECT_ADAPTER } from '@kadena/wallet-adapter-walletconnect';

type WalletName = (typeof WALLETTYPES)[keyof typeof WALLETTYPES];

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function mapWalletAdapterAccount(
  adapterAccount: IAccountInfo,
  walletName: WalletName,
): IWalletAccount {
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

const NAMES_MAP = {
  [WALLETTYPES.CHAINWEAVER]: CHAINWEAVER_ADAPTER,
  [WALLETTYPES.ECKO]: ECKO_ADAPTER,
  [WALLETTYPES.MAGIC]: MAGIC_ADAPTER,
  [WALLETTYPES.WALLETCONNECT]: WALLET_CONNECT_ADAPTER,
} as const satisfies Record<WalletName, string>;

export function getWalletAdapterName(
  walletName: WalletName,
): string | undefined {
  return NAMES_MAP[walletName] ?? undefined;
}
