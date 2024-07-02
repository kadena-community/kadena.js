import type { IButtonProps } from '@kadena/kode-ui';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

export interface IConnectLedgerButtonProps extends IButtonProps {
  isConnected?: boolean;
}

export const ConnectLedgerButton: FC<IConnectLedgerButtonProps> = ({
  isConnected = false,
  ...rest
}) => {
  if (isConnected) {
    return null;
  }

  return <Button {...rest}>Connect Ledger</Button>;
};
