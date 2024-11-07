import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { ListItem } from '@/Components/ListItem/ListItem';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import {
  contactRepository,
  IContact,
} from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import {
  MonoAccountBalanceWallet,
  MonoContacts,
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
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { panelClass } from '../home/style.css';
import { ContactForm } from './Components/ContactForm';

export function Contacts() {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [editContact, setEditContact] = useState<IContact | undefined>();
  const { contacts } = useWallet();
  const prompt = usePrompt();

  const closeForm = () => {
    setIsRightAsideExpanded(false);
    setEditContact(undefined);
  };

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoContacts />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/contacts">
          Contacts
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <ContactForm
        input={editContact}
        onClose={closeForm}
        onDone={closeForm}
        isOpen={isRightAsideExpanded}
      />

      <Stack
        width="100%"
        flexDirection={'column'}
        className={panelClass}
        gap={'md'}
      >
        <Stack justifyContent={'space-between'}>
          <Heading variant="h3">Contacts</Heading>

          <Button
            onPress={() => {
              setEditContact(undefined);
              setIsRightAsideExpanded(true);
            }}
            variant="outlined"
            isCompact
          >
            Add Contact
          </Button>
        </Stack>
        <Stack flexDirection={'column'}>
          {contacts.map((contact) => (
            <ListItem key={contact.uuid}>
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
                        setIsRightAsideExpanded(true);
                        setEditContact(contact);
                      }}
                    />

                    <ContextMenuItem
                      label="Delete"
                      onClick={async () => {
                        const confirm = await prompt((resolve, reject) => (
                          <ConfirmDeletion
                            onCancel={() => reject()}
                            onDelete={() => resolve(true)}
                            title="Delete Contact"
                            description="Are you sure you want to delete this contact?"
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
    </>
  );
}
