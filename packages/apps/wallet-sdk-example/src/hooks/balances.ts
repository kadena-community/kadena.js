import { ChainId } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import { useEffect, useState } from 'react';
import { Account } from '../state/wallet';
import { parseBalance } from '../utils/chainweb';

export const useAccountBalance = (
  account: Account,
  networkId: string,
  fungible: string,
  chainId: ChainId,
) => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const accountDetails = await walletSdk.getAccountDetails(
          account.name,
          networkId,
          fungible,
          [chainId],
        );

        if (accountDetails.length > 0) {
          setBalance(parseBalance(accountDetails[0].accountDetails?.balance));
        } else {
          setBalance('0');
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [account, networkId, fungible, chainId]);

  return { loading, balance, error };
};

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
