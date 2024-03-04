import { AccountHoverTag } from '@/components/Global';
import { Toggle } from '@/components/Global/Toggle';
import type { ILedgerKeyParams } from '@/hooks/use-ledger-public-key';
import { derivationModes } from '@/hooks/use-ledger-public-key';
import {
  marginBottomOnError,
  tooltipInfoContainer,
} from '@/pages/transactions/transfer/styles.css';
import { SystemIcons } from '@kadena/react-components';
import { NumberField, Stack, SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

export interface ILedgerDetails {
  getPublicKey: (params: ILedgerKeyParams) => Promise<string | undefined>;
  setKeyId: (keyId: number) => void;
  legacyToggleOn: boolean;
  setLegacyToggleOn: (toggleOn: boolean) => void;
  isErroneous?: boolean;
}

export const LedgerDetails = ({
  getPublicKey,
  setKeyId,
  legacyToggleOn,
  setLegacyToggleOn,
  isErroneous,
}: ILedgerDetails): React.JSX.Element => {
  const { t } = useTranslation('common');

  const publicKey: string = '';
  const derivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  const setLegacyOn = () => {
    setLegacyToggleOn(!legacyToggleOn);
  };

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
          label="Key Index"
          onValueChange={async (value) => {
            await getPublicKey({ keyId: value, derivationMode });
            setKeyId(value);
          }}
          isInvalid={isErroneous}
          errorMessage={
            isErroneous ? 'You need to connect to your Ledger device.' : ''
          }
          minValue={0}
          maxValue={99}
        />
        <div
          className={classNames(
            tooltipInfoContainer,
            isErroneous ? marginBottomOnError : null,
          )}
        >
          <Tooltip content={t('ledger tooltip content')} position={'top'}>
            <SystemIcons.Information />
          </Tooltip>
        </div>
      </Stack>

      <Toggle
        label={t('is Legacy')}
        toggled={legacyToggleOn}
        onClick={setLegacyOn}
      />
      {publicKey ? <AccountHoverTag value={publicKey.slice(0, 15)} /> : null}
    </Stack>
  );
};
