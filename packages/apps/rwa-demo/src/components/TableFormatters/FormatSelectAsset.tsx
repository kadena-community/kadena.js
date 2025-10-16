import {
  useEventsQuery,
  useEventSubscriptionSubscription,
} from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAsset } from '@/hooks/asset';
import { useTransactions } from '@/hooks/transactions';
import { getAsset } from '@/utils/getAsset';
import { MonoFindInPage, MonoWarning } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

export interface IActionProps {}

export const FormatSelectAsset = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const [hasError, setHasError] = useState(false);
    const [isCreatingContract, setIsCreatingContract] = useState(false);

    const { getTransactions, transactions } = useTransactions();
    const { setAsset, asset: currentAsset } = useAsset();
    const { addNotification } = useNotifications();
    const asset = value as unknown as IAsset | undefined;

    const { data, loading } = useEventsQuery({
      variables: {
        qualifiedName: `${getAsset(asset)}.UPDATED-TOKEN-INFORMATION`,
      },
      fetchPolicy: 'no-cache',
    });

    const { data: subscriptionData } = useEventSubscriptionSubscription({
      variables: {
        qualifiedName: `${getAsset(asset)}.UPDATED-TOKEN-INFORMATION`,
      },
    });

    useEffect(() => {
      if (!asset?.uuid || !currentAsset?.uuid) return;
      if (asset.uuid !== currentAsset.uuid || transactions.length === 0) {
        setIsCreatingContract(false);
        return;
      }

      const creatingContractTx = getTransactions(TXTYPES.CREATECONTRACT);
      setIsCreatingContract(!!creatingContractTx);
    }, [asset?.uuid, transactions.length, currentAsset?.uuid]);

    useEffect(() => {
      if (loading) return;
      if (data?.events.edges.length === 0) {
        setHasError(true);
      }
    }, [data?.events.edges, subscriptionData?.events, loading]);

    const handleLink = async () => {
      if (!asset) {
        addNotification({
          intent: 'negative',
          label: 'asset is not found',
        });
        return;
      }
      setAsset(asset);
      window.location.href = '/';
    };

    console.log(
      2222,
      asset?.contractName,
      isCreatingContract,
      loading,
      hasError,
    );
    if (loading || (hasError && isCreatingContract)) {
      return (
        <Button
          isDisabled
          isCompact
          variant="outlined"
          title="creation transaction pending"
          startVisual={
            <TransactionTypeSpinner
              type={TXTYPES.CREATECONTRACT}
              fallbackIcon={<TransactionPendingIcon />}
            />
          }
        />
      );
    }

    if (hasError && !isCreatingContract) {
      return (
        <Button
          isDisabled
          isCompact
          variant="outlined"
          title="asset not found"
          aria-label="asset not found"
          startVisual={<MonoWarning />}
        />
      );
    }

    return (
      <Button
        aria-label="Select asset"
        isCompact
        variant="outlined"
        startVisual={<MonoFindInPage />}
        onPress={handleLink}
      />
    );
  };
  return Component;
};
