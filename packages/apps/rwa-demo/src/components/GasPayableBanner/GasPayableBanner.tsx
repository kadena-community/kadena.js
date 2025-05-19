import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useFaucet } from '@/hooks/faucet';
import { env } from '@/utils/env';
import { MonoMonetizationOn } from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

export const GasPayableBanner: FC = () => {
  const { submit, isAllowed } = useFaucet();
  const { addNotification } = useNotifications();

  const handleAddKda = async () => {
    const tx = await submit();
    tx?.listener.subscribe(
      () => {},
      () => {},
      () => {
        addNotification({
          intent: 'positive',
          label: 'KDA added to account',
          message: `We added ${env.FAUCETAMOUNT} KDA to the account`,
        });
      },
    );
  };

  if (!isAllowed) return null;

  return (
    <Notification intent="warning" role="status" type="stacked">
      <NotificationHeading>
        The account has no balance to pay the gas
      </NotificationHeading>
      <NotificationFooter>
        <Button
          isDisabled={!isAllowed}
          onPress={handleAddKda}
          variant="warning"
          endVisual={
            <TransactionTypeSpinner
              type={TXTYPES.FAUCET}
              fallbackIcon={<MonoMonetizationOn />}
            />
          }
        >
          Add 5 KDA for Gas
        </Button>
      </NotificationFooter>
    </Notification>
  );
};
