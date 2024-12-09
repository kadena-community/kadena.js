import { Keyset } from '@/pages/transfer-v2/Components/keyset';
import { IReceiverAccount } from '@/pages/transfer-v2/utils';
import { MonoAttachMoney, MonoLink } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { FC, ReactNode } from 'react';
import { discoverdAccountClass } from './style.css';

export const DiscoverdAccounts: FC<{
  accounts: IReceiverAccount[];
  onSelect: (selected: IReceiverAccount) => void;
  onClosed: () => void;
  inline?: boolean;
}> = ({ accounts, onSelect, onClosed, inline }) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    if (inline) {
      return <Stack gap={'sm'}>{children}</Stack>;
    }
    return (
      <Dialog
        size="sm"
        isOpen={accounts.length > 0}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClosed();
          }
        }}
      >
        {children}
      </Dialog>
    );
  };

  return (
    <Wrapper>
      {!inline && <DialogHeader>Select the receiver account</DialogHeader>}
      <DialogContent>
        <Stack flexDirection={'column'} gap={'sm'}>
          <Text>
            There are {accounts.length} accounts associated with the same
            address on the Blockchain. Please select the account you want to
            use.
          </Text>
          <Text>Address: {accounts[0].address}</Text>
          <Stack flexDirection={'column'}>
            {accounts.map((account) => (
              <Stack
                gap={'sm'}
                alignItems={'center'}
                className={discoverdAccountClass}
                justifyContent={'space-between'}
              >
                <Stack
                  gap={inline ? undefined : 'sm'}
                  flexDirection={inline ? 'column' : 'row'}
                  flex={1}
                >
                  <Text size="smallest" color="emphasize">
                    <Stack gap={'xs'} alignItems={'center'}>
                      <MonoAttachMoney />
                      {account.overallBalance}
                    </Stack>
                  </Text>
                  <Text size="smallest" color="emphasize">
                    <Stack gap={'xs'} alignItems={'center'}>
                      <MonoLink /> (
                      {account.chains.map(({ chainId }) => chainId).join(',')})
                    </Stack>
                  </Text>
                </Stack>
                <Stack
                  gap={'sm'}
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                >
                  <Keyset guard={account.keyset.guard} />
                  <Stack>
                    <Button
                      isCompact
                      variant="outlined"
                      onPress={() => onSelect(account)}
                    >
                      Select
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
    </Wrapper>
  );
};
