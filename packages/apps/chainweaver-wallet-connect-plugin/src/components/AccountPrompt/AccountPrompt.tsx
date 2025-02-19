import { IAccount } from '../communicate.ts';
import {
  Button,
  Dialog,
  Heading,
  Checkbox,
  Stack,
  Text,
} from '@kadena/kode-ui';
import React, { useState } from 'react';
import { accountPrompt } from './style.css.ts';

export const AccountPrompt: React.FC<{
  accounts: IAccount[]
  onAccountsSelected: (accounts: IAccount[]) => void;
}> = ({ accounts, onAccountsSelected }) => {
  const [selectedAccounts, setSelectedAccounts] = useState<IAccount[]>([]);

  function onCheckboxChange(isSelected: boolean, account: IAccount) {
    if(isSelected) {
      setSelectedAccounts((prev) => [...prev, account]);
    } else {
      setSelectedAccounts((prev) => prev.filter((acc) => acc.address !== account.address));
    }
  }

  function cancel() {
    onAccountsSelected([]);
  }

  return (
    <Dialog
      size="sm"
      isOpen={true}
      className={accountPrompt}
      onOpenChange={cancel}
    >
      <Stack flexDirection={'column'} gap={'md'}>
        <Heading>Select Accounts</Heading>
        <Text>
          Select the accounts you want to make available to the dApp
        </Text>
        {accounts.map((account) => (
          <Stack key={account.address} gap={'sm'}>
            <Checkbox isSelected={selectedAccounts.includes(account)} onChange={(isSelected) => onCheckboxChange(isSelected, account ) }>
              {`${account.alias} - ${account.address}`}
           </Checkbox>
          </Stack>
        ))}

        <Stack gap={'sm'}>
          <Button variant="transparent" type="reset" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onAccountsSelected(selectedAccounts)} isDisabled={selectedAccounts.length === 0}>
            Select
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
