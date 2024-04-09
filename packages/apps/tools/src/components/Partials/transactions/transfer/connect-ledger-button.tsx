import { Button } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export interface IConnectLedgerButtonProps {
  isConnected?: boolean;
}

export const ConnectLedgerButton: FC<IConnectLedgerButtonProps> = ({
  isConnected = false,
}) => {
  if (isConnected) {
    return null;
  }

  return (
    <Button
    // onPress={() => getter({ keyId: 0 })} isLoading={state.loading}
    >
      Connect Ledger
    </Button>
  );
};
