import { AccountHoverTag } from '@/components/Global';
// import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import { Toggle } from '@/components/Global/Toggle';
import { derivationModes } from '@/hooks/use-ledger-public-key';
import { Combobox, ComboboxItem, Stack, SystemIcon } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

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

  const setLegacyOn = () => {
    setLegacyToggleOn(!legacyToggleOn);
  };

  return (
    <>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Combobox
          allowsCustomValue
          startIcon={<SystemIcon.KeyIconFilled />}
          label="Key ID"
          onInputChange={async (value) => {
            console.log('onInputChange', value);
            await getPublicKey({
              keyId: parseInt(value, 10),
              derivationMode,
            });
            setKeyId(value);
          }}
          defaultItems={options}
        >
          {(item) => <ComboboxItem key={item.id}>{item.name}</ComboboxItem>}
        </Combobox>
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
