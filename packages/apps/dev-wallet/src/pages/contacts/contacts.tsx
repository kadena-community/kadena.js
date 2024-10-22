import { ListItem } from '@/Components/ListItem/ListItem';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import {
  contactRepository,
  IContact,
} from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import {
  MonoAccountBalanceWallet,
  MonoMoreVert,
} from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { noStyleLinkClass, panelClass } from '../home/style.css';
import { ConfirmDeletion, ContactDialog } from './Components/ContactDialog';

export function Contacts() {
  const { contacts } = useWallet();
  const prompt = usePrompt();
  const [showAddContact, setShowAddContact] = useState(false);
  const [editContact, setEditContact] = useState<IContact>();
  const closeDialog = () => {
    setShowAddContact(false);
    setEditContact(undefined);
  };
  return (
    <Stack flexDirection={'column'} className={panelClass} gap={'md'}>
      {showAddContact && (
        <ContactDialog
          input={editContact}
          onClose={closeDialog}
          onDone={closeDialog}
        />
      )}
      <Stack justifyContent={'space-between'}>
        <Heading variant="h3">Contacts</Heading>
        <Button
          variant="outlined"
          isCompact
          onClick={() => setShowAddContact(true)}
        >
          Add Contact
        </Button>
      </Stack>
      <Stack flexDirection={'column'}>
        {contacts.map((contact) => (
          <ListItem>
            <Stack
              key={contact.uuid}
              gap="sm"
              alignItems={'center'}
              justifyContent={'space-between'}
              flex={1}
            >
              <Stack gap={'sm'}>
                <Heading variant="h6">{contact.name}</Heading>
                {contact.email && <Text>({contact.email})</Text>}
              </Stack>
              <Stack flexDirection={'row'} gap={'sm'} alignItems={'center'}>
                <Stack gap={'sm'}>
                  <MonoAccountBalanceWallet />{' '}
                  <Text>{shorten(contact.account.address)}</Text>
                </Stack>

                <ContextMenu
                  placement="bottom end"
                  trigger={
                    <Button
                      endVisual={<MonoMoreVert />}
                      variant="transparent"
                      isCompact
                    />
                  }
                >
                  <ContextMenuItem
                    label="Edit"
                    onClick={() => {
                      setEditContact(contact);
                      setShowAddContact(true);
                    }}
                  />
                  <Link
                    to={`/contacts/${contact.uuid}`}
                    className={noStyleLinkClass}
                  >
                    <ContextMenuItem label="View" />
                  </Link>
                  <ContextMenuItem
                    label="Delete"
                    onClick={async () => {
                      const confirm = await prompt((resolve, reject) => (
                        <ConfirmDeletion
                          onCancel={() => reject()}
                          onConfirm={() => resolve(true)}
                        />
                      ));
                      if (confirm) {
                        await contactRepository.deleteContact(contact.uuid);
                      }
                    }}
                  />
                </ContextMenu>
              </Stack>
            </Stack>
          </ListItem>
        ))}
      </Stack>
    </Stack>
  );
}
