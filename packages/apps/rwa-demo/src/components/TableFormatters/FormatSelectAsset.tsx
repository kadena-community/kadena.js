import {
  useEventsQuery,
  useEventSubscriptionSubscription,
} from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAsset } from '@/hooks/asset';
import { getAsset } from '@/utils/getAsset';
import { MonoFindInPage, MonoWarning } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

export interface IActionProps {}

export const FormatSelectAsset = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const [hasError, setHasError] = useState(false);

    const { setAsset } = useAsset();
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

    if (loading) {
      return (
        <Button
          isDisabled
          isCompact
          variant="outlined"
          title="creation transaction pending"
        >
          <TransactionPendingIcon />
        </Button>
      );
    }

    if (hasError) {
      return (
        <Button
          isDisabled
          isCompact
          variant="outlined"
          title="asset not found"
          aria-label="asset not found"
        >
          <MonoWarning />
        </Button>
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
