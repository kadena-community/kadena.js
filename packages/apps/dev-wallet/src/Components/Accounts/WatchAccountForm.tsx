import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { IContact } from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { MonoAccountBalanceWallet } from '@kadena/kode-icons/system';
import { Button, Checkbox, Heading, Stack, Text } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { AccountInput } from '../AccountInput/AccountInput';
import { ListItem } from '../ListItem/ListItem';

export function WatchAccountsForm({
  contract,
  networkId,
  onWatch,
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  contract: string;
  networkId: string;
  onWatch: (account: IRetrievedAccount[]) => void;
  onClose: () => void;
}) {
  const { contacts, fungibles } = useWallet();
  const asset = fungibles.find((f) => f.contract === contract);
  const [account, setAccount] = useState<IRetrievedAccount>();
  const [address, setAddress] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([]);
  return (
    <RightAside isOpen={isOpen} onClose={onClose}>
      <RightAsideHeader label="Watch Account" />
      <RightAsideContent>
        <Stack gap={'xl'} flexDirection={'column'}>
          <Heading variant="h6">
            You can add or watch any account that exists on the blockchain.
          </Heading>
          <Stack gap={'md'} flexDirection={'column'}>
            <Heading variant="h6">Enter a {asset?.symbol} Address</Heading>
            <AccountInput
              address={address}
              setAddress={setAddress}
              onAccount={setAccount}
              account={account}
              networkId={networkId}
              contract={contract}
            />
          </Stack>
          {contacts.length > 0 && (
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
          )}
        </Stack>
      </RightAsideContent>
      <RightAsideFooter>
        <Button variant="transparent" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!account && !selectedContacts.length) return;
            const accounts = [
              account,
              ...selectedContacts.map((data) => {
                const acc: IRetrievedAccount = {
                  alias: data.name,
                  chains: [],
                  overallBalance: '0.0',
                  address: data.account.address,
                  guard: data.account.guard,
                };
                return acc;
              }),
            ].filter(Boolean) as IRetrievedAccount[];
            onWatch(accounts);
            onClose();
          }}
          isDisabled={!account && !selectedContacts.length}
        >
          Watch
        </Button>
      </RightAsideFooter>
    </RightAside>
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
