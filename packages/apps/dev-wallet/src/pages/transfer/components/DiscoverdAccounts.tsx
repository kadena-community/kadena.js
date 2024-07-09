import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { FC } from 'react';
import { IReceiverAccount } from '../utils';
import { discoverdAccountClass } from './style.css';

export const DiscoverdAccounts: FC<{
  accounts: IReceiverAccount[];
  onSelect: (selected: IReceiverAccount) => void;
}> = ({ accounts, onSelect }) => (
  <Dialog size="lg" isOpen={true}>
    <DialogHeader>Select the receiver account</DialogHeader>
    <DialogContent>
      <Stack flexDirection={'column'} gap={'sm'}>
        <Text>
          There are {accounts.length} accounts associated with the same address
          on the Blockchian. Please select the account you want to use.
        </Text>
        <Text>Address: {accounts[0].address}</Text>
        <Stack flexDirection={'column'}>
          {accounts.map((account) => (
            <Stack flexDirection={'column'} className={discoverdAccountClass}>
              <Text color="emphasize">
                Chains: (
                {account.chains.map(({ chainId }) => chainId).join(', ')})
              </Text>
              <Text color="emphasize">Balance: {account.overallBalance}</Text>
              <Text bold color="emphasize">
                Guard
              </Text>
              <pre>{JSON.stringify(account.keyset.guard, null, 2)}</pre>
              <Stack justifyContent={'flex-end'}>
                <Button onPress={() => onSelect(account)}>Select</Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </DialogContent>
  </Dialog>
);
