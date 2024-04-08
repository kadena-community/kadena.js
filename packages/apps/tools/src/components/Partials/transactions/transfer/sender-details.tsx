import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import type { ChainId } from '@kadena/types';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { LedgerDetails } from './ledger-details';
import type { FormData } from './sign-form';
import type { accountFromOptions } from './sign-form-sender';
import type { ITestProps } from './test';
import { Test } from './test';

export interface ISenderDetailsProps {
  type: (typeof accountFromOptions)[number];
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
  senderDataQuery: ITestProps['senderDataQuery'];
  onChainUpdate: (chainId: ChainId) => void;
}

export const SenderDetails: FC<ISenderDetailsProps> = ({
  type,
  onKeyIdUpdate,
  onDerivationUpdate,
  senderDataQuery,
  onChainUpdate,
}) => {
  const {
    setValue,
    formState: { errors },
    register,
    control,
  } = useFormContext<FormData>();

  const isLedger = type === 'Ledger';

  const onLedgerKeyUpdate = useCallback(
    (ledgerPublicKey: string) => {
      setValue('sender', `k:${ledgerPublicKey}`);
    },
    [setValue],
  );

  return (
    <>
      {isLedger && (
        <LedgerDetails
          onLedgerKeyUpdate={onLedgerKeyUpdate}
          onKeyIdUpdate={onKeyIdUpdate}
          onDerivationUpdate={onDerivationUpdate}
        />
      )}
      <Test
        isLedger={isLedger}
        senderDataQuery={senderDataQuery}
        onChainUpdate={onChainUpdate}
      />
    </>
  );
};
