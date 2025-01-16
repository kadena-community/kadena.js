import { useAccount } from '@/hooks/account';
import { MonoMonetizationOn } from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import type { FC } from 'react';

export const GasPayableBanner: FC = () => {
  const { isGasPayable } = useAccount();

  const handleAddKda = () => {};

  if (isGasPayable) return null;

  return (
    <Notification intent="warning" role="status" type="stacked">
      <NotificationHeading>
        The account has no balance to pay the gas
      </NotificationHeading>
      <NotificationFooter>
        <Button
          onPress={handleAddKda}
          variant="warning"
          endVisual={<MonoMonetizationOn />}
        >
          Add 5 KDA for Gas
        </Button>
      </NotificationFooter>
    </Notification>
  );
};
