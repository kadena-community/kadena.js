import { AccountHoverTag } from '@/components/Global';
// import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import { Combobox, ComboboxItem, SystemIcon } from '@kadena/react-ui';
import React from 'react';

const options = Array.from({ length: 100 }, (_, i) => ({
  label: `${i}`,
  value: i,
}));

const LedgerDetails = (): React.JSX.Element => {
  // const [keyId, setKeyId] = useState<number>();
  // const publicKey = useLedgerPublicKey(keyId);
  const publicKey: string = '';

  return (
    <>
      <Combobox
        startIcon={<SystemIcon.KeyIconFilled />}
        allowsCustomValue
        defaultItems={options}
      >
        {(item) => (
          <ComboboxItem key={`ledger-key-${item.value}`}>
            {item.label}
          </ComboboxItem>
        )}
      </Combobox>
      {publicKey ? <AccountHoverTag value={publicKey.slice(0, 15)} /> : null}
    </>
  );
};

export default LedgerDetails;
