import { Button, Dialog, Heading, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { IReceiverAccount } from '../utils';

export const DiscoverdAccounts: FC<{
  accounts: IReceiverAccount[];
  onSelect: (selected: IReceiverAccount) => void;
}> = ({ accounts, onSelect }) => (
  <Dialog size="sm" isOpen={true}>
    <Stack flexDirection={'column'} gap={'sm'}>
      <Heading variant="h2">Select the receiver account</Heading>
      <Text>
        There are {accounts.length} accounts associated with the same address on
        the Blockchian. Please select the account you want to use.
      </Text>
      {accounts.map((account) => (
        <Stack key={account.address} justifyContent={'space-between'}>
          <Text>{account.address}</Text>
          <Button onPress={() => onSelect(account)}>Select</Button>
        </Stack>
      ))}
    </Stack>
  </Dialog>
);
