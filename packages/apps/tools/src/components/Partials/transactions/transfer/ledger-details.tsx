import { AccountHoverTag } from '@/components/Global';
// import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import { Toggle } from '@/components/Global/Toggle';
import { derivationModes } from '@/hooks/use-ledger-public-key';
import {
  marginBottomOnError,
  tooltipInfoContainer,
} from '@/pages/transactions/transfer/styles.css';
import { SystemIcons } from '@kadena/react-components';
import { NumberField, Stack, SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';

export interface ILedgerDetails {
  getPublicKey: any;
  setKeyId: any;
  legacyToggleOn: boolean;
  setLegacyToggleOn: any;
}

export const LedgerDetails = ({
  getPublicKey,
  setKeyId,
  legacyToggleOn,
  setLegacyToggleOn,
}: ILedgerDetails): React.JSX.Element => {
  const { t } = useTranslation('common');

  const publicKey: string = '';
  const derivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  const [errorLedgerKey, setErrorLedgerKey] = useState<boolean>(false);
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
          onChange={async (event) => {
            const value = event.target.value;
            await getPublicKey({
              keyId: parseInt(value, 10),
              derivationMode,
            });

            if (isNaN(+value)) return setErrorLedgerKey(true);
            setKeyId(value);
            setErrorLedgerKey(false);
          }}
          isInvalid={errorLedgerKey}
          errorMessage={errorLedgerKey ? 'Enter number from 1 to 99' : ''}
          minValue={0}
          maxValue={99}
        />
        <div
          className={classNames(
            tooltipInfoContainer,
            errorLedgerKey ? marginBottomOnError : null,
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
