import { IContact } from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IReceiverAccount } from '@/pages/transfer/utils';
import { shorten } from '@/utils/helpers';
import { MonoAccountBalanceWallet } from '@kadena/kode-icons/system';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { AccountInput } from '../AccountInput/AccountInput';
import { ListItem } from '../ListItem/ListItem';

export function WatchAccountsDialog({
  onClose,
  contract,
  networkId,
  onWatch,
}: {
  contract: string;
  networkId: string;
  onClose: () => void;
  onWatch: (account: IReceiverAccount[]) => void;
}) {
  const { contacts } = useWallet();
  const [account, setAccount] = useState<IReceiverAccount>();
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([]);
  return (
    <Dialog isOpen onOpenChange={(isOpen) => !isOpen && onClose()} size="sm">
      <DialogHeader>Watch Account</DialogHeader>
      <DialogContent>
        <Stack gap={'xl'} flexDirection={'column'}>
          <Heading variant="h6">
            You can watch any account on the network.
          </Heading>
          <Stack gap={'md'} flexDirection={'column'}>
            <Heading variant="h6">Enter Address</Heading>
            <AccountInput
              onAccount={setAccount}
              account={account}
              networkId={networkId}
              contract={contract}
            />
          </Stack>
          <Stack flexDirection={'column'}>
            <Stack marginBlockEnd={'sm'}>
              <Heading variant="h6">Watch your contacts</Heading>
            </Stack>
            {contacts.map((contact) => (
              <ListItem>
                <Stack
                  alignItems={'center'}
                  flex={1}
                  gap={'md'}
                  onClick={() => {
                    setSelectedContacts((prev) =>
                      prev.find((c) => c.uuid === contact.uuid)
                        ? prev.filter((c) => c.uuid !== contact.uuid)
                        : [...prev, contact],
                    );
                  }}
                >
                  <Checkbox
                    isSelected={
                      !!selectedContacts.find((c) => c.uuid === contact.uuid)
                    }
                    onChange={(isSelected) => {
                      setSelectedContacts((prev) =>
                        isSelected
                          ? [...prev, contact]
                          : prev.filter((c) => c.uuid !== contact.uuid),
                      );
                    }}
                  >
                    {' '}
                  </Checkbox>
                  <ContactItem contact={contact} />
                </Stack>
              </ListItem>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogFooter>
        <Button variant="transparent" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!account && !selectedContacts.length) return;
            const accounts = [
              account,
              ...selectedContacts.map((data) => {
                const acc: IReceiverAccount = {
                  chains: [],
                  overallBalance: '0.0',
                  address: data.account.address,
                  keyset: { guard: data.account.keyset! },
                };
                return acc;
              }),
            ].filter(Boolean) as IReceiverAccount[];
            onWatch(accounts);
            onClose();
          }}
          isDisabled={!account && !selectedContacts.length}
        >
          Watch
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function ContactItem({ contact }: { contact: IContact }) {
  return (
    <Stack flex={1}>
      <Stack gap={'sm'} flex={1}>
        <Heading variant="h6">{contact.name}</Heading>
        {contact.email && <Text>({contact.email})</Text>}
      </Stack>
      <Stack flexDirection={'row'} gap={'sm'} alignItems={'center'}>
        <Stack gap={'sm'}>
          <Text>
            <MonoAccountBalanceWallet />
          </Text>
          <Text>{shorten(contact.account.address)}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
