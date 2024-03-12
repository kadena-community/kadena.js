import { Toggle } from '@/components/Global/Toggle';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
} from '@/hooks/use-ledger-public-key';
import {
  marginBottomOnError,
  tooltipInfoContainer,
} from '@/pages/transactions/transfer/styles.css';
import { NumberField, Stack, SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

export interface ILedgerDetailsProps {
  onLedgerKeyUpdate: (ledgerPublicKey: string) => void;
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
}

export const LedgerDetails: FC<ILedgerDetailsProps> = ({
  onLedgerKeyUpdate,
  onKeyIdUpdate,
  onDerivationUpdate,
}) => {
  const { t } = useTranslation('common');

  const [state, getter] = useLedgerPublicKey();

  const [keyIndex, setKeyIndex] = useState<number>();
  const [legacyToggleOn, setLegacyOn] = useState<boolean>(false);

  const derivationMode: DerivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  useEffect(() => {
    onDerivationUpdate(derivationMode);
  }, [derivationMode, onDerivationUpdate]);

  useEffect(() => {
    // Whenever the keyIndex or derivation mode (legacy or not) changes, we need to get the public key
    if (typeof keyIndex === 'number') {
      void getter({ keyId: keyIndex, derivationMode });
    }
  }, [keyIndex, derivationMode, getter]);

  useEffect(() => {
    if (state.value) {
      onLedgerKeyUpdate(state.value);
    }
  }, [onLedgerKeyUpdate, state.value]);

  return (
    <Stack
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'flex-end'}
      marginBlockStart={'md'}
    >
      <Stack gap={'md'}>
        <NumberField
          startAddon={<SystemIcon.KeyIconFilled />}
          label={t('Key Index')}
          onValueChange={(keyIndex) => {
            setKeyIndex(keyIndex);
            onKeyIdUpdate(keyIndex);
          }}
          isInvalid={!!state.error}
          errorMessage={
            state.error ? 'You need to connect to your Ledger device.' : ''
          }
          minValue={0}
          maxValue={99}
        />
        <div
          className={classNames(
            tooltipInfoContainer,
            state.error ? marginBottomOnError : null,
          )}
        >
          <Tooltip content={t('ledger tooltip content')} position={'top'}>
            <SystemIcon.Information />
          </Tooltip>
        </div>
      </Stack>
      <Toggle
        label={t('is Legacy')}
        onClick={setLegacyOn}
        toggled={legacyToggleOn}
      />
    </Stack>
  );
};
