import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import { Stack } from '@kadena/react-ui';
import type { ChainId } from '@kadena/types';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LedgerDetails } from './ledger-details';
import type { ISenderDetailsProps } from './sender-details';
import { SenderDetails } from './sender-details';
import type { FormData } from './sign-form';
import type { accountFromOptions } from './sign-form-sender';

export interface ISenderFieldsProps {
  type: (typeof accountFromOptions)[number];
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
  senderDataQuery: ISenderDetailsProps['senderDataQuery'];
  onChainUpdate: (chainId: ChainId) => void;
}

export const SenderFields: FC<ISenderFieldsProps> = ({
  type,
  onKeyIdUpdate,
  onDerivationUpdate,
  senderDataQuery,
  onChainUpdate,
}) => {
  const { setValue, clearErrors } = useFormContext<FormData>();

  const [isConnected, setIsConnected] = useState(false);

  const isLedger = type === 'Ledger';

  const onLedgerKeyUpdate = useCallback(
    (ledgerPublicKey: string) => {
      setValue('sender', `k:${ledgerPublicKey}`);
      setIsConnected(true);
      setValue('isConnected', true);
      clearErrors('isConnected');
    },
    [clearErrors, setValue],
  );

  return (
    <Stack
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="stretch"
      gap="md"
    >
      {isLedger && (
        <LedgerDetails
          onLedgerKeyUpdate={onLedgerKeyUpdate}
          onKeyIdUpdate={onKeyIdUpdate}
          onDerivationUpdate={onDerivationUpdate}
        />
      )}
      <SenderDetails
        isLedger={isLedger}
        senderDataQuery={senderDataQuery}
        onChainUpdate={onChainUpdate}
        isConnected={isConnected}
      />
    </Stack>
  );
};
