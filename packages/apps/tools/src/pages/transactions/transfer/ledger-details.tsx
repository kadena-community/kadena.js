import { AccountHoverTag } from '@/components/Global';
// import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import { Toggle } from '@/components/Global/Toggle';
import { derivationModes } from '@/hooks/use-ledger-public-key';
import {
  marginBottomOnError,
  tooltipInfoContainer,
} from '@/pages/transactions/transfer/styles.css';
import { SystemIcons } from '@kadena/react-components';
import {
  Combobox,
  ComboboxItem,
  Stack,
  SystemIcon,
  Tooltip,
} from '@kadena/react-ui';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';

const options = Array.from({ length: 10 }, (_, i) => ({
  id: `ledger-key-${i}`,
  name: `${i}`,
}));

export interface ILedgerDetails {
  getPublicKey: any;
  setKeyId: any;
  legacyToggleOn: boolean;
  setLegacyToggleOn: any;
}

const LedgerDetails = ({
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
    <>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Stack alignItems={'flex-end'} gap={'md'}>
          <Combobox
            allowsCustomValue
            startIcon={<SystemIcon.KeyIconFilled />}
            label="Key Index"
            onInputChange={async (value) => {
              await getPublicKey({
                keyId: parseInt(value, 10),
                derivationMode,
              });

              if (isNaN(+value)) return setErrorLedgerKey(true);
              setKeyId(value);
              setErrorLedgerKey(false);
            }}
            defaultItems={options}
            isInvalid={errorLedgerKey}
            errorMessage={errorLedgerKey ? 'Enter number from 1 to 99' : ''}
          >
            {(item) => <ComboboxItem key={item.id}>{item.name}</ComboboxItem>}
          </Combobox>
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
    </>
  );
};

export default LedgerDetails;
