import { AccountHoverTag } from '@/components/Global';
import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import {
  Button,
  Combobox,
  ComboboxItem,
  SystemIcon,
  Text,
  ToggleButton,
} from '@kadena/react-ui';
import React, { useState } from 'react';

const options = Array.from({ length: 100 }, (_, i) => ({
  label: `${i}`,
  value: i,
}));

const LedgerDetails = () => {
  const [ledgerDetailsExpanded, setLedgerDetailsExpanded] = useState(false);

  const [keyId, setKeyId] = useState<number>();
  const publicKey = useLedgerPublicKey(keyId);

  return (
    <>
      <ToggleButton
        isSelected={ledgerDetailsExpanded}
        onChange={setLedgerDetailsExpanded}
        startIcon={
          ledgerDetailsExpanded ? (
            <SystemIcon.ChevronUp />
          ) : (
            <SystemIcon.ChevronDown />
          )
        }
      >
        Change/Verify Ledger Account
      </ToggleButton>
      {ledgerDetailsExpanded ? (
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
          {publicKey ? (
            <AccountHoverTag value={publicKey.slice(0, 15)} />
          ) : (
            <Text as="code">Connect with your ledger to fetch your key</Text>
          )}
          <Button>Verify</Button>
        </>
      ) : null}
    </>
  );
};

export default LedgerDetails;
