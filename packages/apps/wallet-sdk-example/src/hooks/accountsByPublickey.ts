import type {
  IFungibleAccount,
  IFungibleAccountsResponse,
} from '@kadena/wallet-sdk';
import { walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useWalletState } from '../state/wallet';
import { useFunctionTracker } from './functionTracker';

/**
 * Custom hook to fetch fungible accounts by public key.
 *
 * @param publicKey - The public key associated with the account.
 * @param fungibleName - The name of the fungible token.
 * @param graphType - The type of GraphQL endpoint to use (Kadena or Hackachain).
 * @returns An object containing the fetched accounts, loading state, error, and refetch function.
 */
export const useAccountsByPublicKey = (
  publicKey: string,
  fungibleName: string,
) => {
  const wallet = useWalletState();
  const [accounts, setAccounts] = useState<IFungibleAccount[]>([]);

  const trackGetAccounts = useFunctionTracker(
    'walletSdk.getFungibleAccountsByPublicKey',
  );

  const {
    data: accountsResponse,
    error,
    isLoading,
    refetch,
  } = useQuery<IFungibleAccountsResponse | undefined>({
    queryKey: [
      'accountsByPublicKey',
      publicKey,
      fungibleName,
      wallet.selectedNetwork,
    ],
    enabled: false,
    queryFn: async () => {
      if (!publicKey || !fungibleName || !wallet.selectedNetwork) {
        return undefined;
      }

      return trackGetAccounts.wrap(walletSdk.getFungibleAccountsByPublicKey)({
        publicKey,
        fungibleName,
        networkId: wallet.selectedNetwork,
      });
    },
  });

  useEffect(() => {
    if (accountsResponse?.fungibleAccounts) {
      setAccounts(accountsResponse.fungibleAccounts);
    } else {
      setAccounts([]);
    }
  }, [accountsResponse]);

  return {
    accounts,
    error,
    isLoading,
    refetch,
    // Demo: Track function calls for debugging or logging purposes
    functionCalls: [trackGetAccounts.data],
  };
};
