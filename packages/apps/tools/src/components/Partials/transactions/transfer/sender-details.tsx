import { AccountNameField } from '@/components/Global';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import { Button, SystemIcon } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LedgerDetails } from './ledger-details';
import type { FormData } from './sign-form';
import type { accountFromOptions } from './sign-form-sender';

export interface ISenderDetailsProps {
  type: (typeof accountFromOptions)[number];
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
}

export const SenderDetails: FC<ISenderDetailsProps> = ({
  type,
  onKeyIdUpdate,
  onDerivationUpdate,
}) => {
  const { t } = useTranslation('common');

  const {
    formState: { errors },
    setValue,
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
      <Controller
        name="sender"
        control={control}
        render={({ field }) => (
          <AccountNameField
            {...field}
            isDisabled={isLedger}
            isInvalid={!!errors.sender}
            errorMessage={errors.sender?.message}
            endAddon={
              <Button
                icon={<SystemIcon.ContentCopy />}
                variant="text"
                onPress={async () => {
                  await navigator.clipboard.writeText(field.value);
                }}
                aria-label="Copy Account Name"
                title="Copy Account Name"
                color="primary"
                type="button"
              />
            }
            description={isLedger ? t('unexpected-account-name') : undefined}
          />
        )}
      />
    </>
  );
};
