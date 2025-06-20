import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { faucet } from '@/services/faucet';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useNetwork } from './networks';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useFaucet = () => {
  const { account, isMounted, isGasPayable } = useAccount();
  const { activeNetwork } = useNetwork();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (): Promise<ITransaction | undefined> => {
    return submit2Chain(undefined, {
      notificationSentryName: 'error:submit:faucet',
      skipAssetCheck: true,
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return faucet(account!);
      },
      transaction: {
        type: TXTYPES.FAUCET,
        accounts: [account?.address ?? ''],
      },
    });
  };

  useEffect(() => {
    if (
      isGasPayable === undefined ||
      !isMounted ||
      (activeNetwork.networkId !== 'development' &&
        activeNetwork.networkId !== 'testnet04')
    )
      return;

    setIsAllowed(!!account?.address && !isGasPayable);
  }, [account?.address, isMounted, isGasPayable]);

  return { submit, isAllowed };
};
