import { ChainId } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import { useEffect, useState } from 'react';
import { Account } from '../state/wallet';
import { parseBalance } from '../utils/chainweb';

export const useAccountsBalances = (
  accounts: Account[],
  networkId: string,
  fungible: string,
  chainId: ChainId[],
) => {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const promises = accounts.map(async (account) => {
      try {
        const balance = await walletSdk.getAccountDetails(
          account.name,
          networkId,
          fungible,
          chainId,
        );
        setBalances((balances) => ({
          ...balances,
          [account.name]: parseBalance(balance[0].accountDetails?.balance),
        }));
      } catch (e) {
        setError(e as any);
      }
    });
    Promise.all(promises).then(() => setLoading(false));
  }, [accounts, networkId, fungible, chainId]);

  return { loading, balances, error };
};
