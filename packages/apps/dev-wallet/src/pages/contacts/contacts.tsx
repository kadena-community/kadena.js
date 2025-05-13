import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import {
  contactRepository,
  IContact,
} from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoContacts } from '@kadena/kode-icons/system';
import { Button, Notification, NotificationHeading } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { ContactForm } from './Components/ContactForm';

export function Contacts() {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const [editContact, setEditContact] = useState<IContact | undefined>();
  const { contacts } = useWallet();
  const prompt = usePrompt();

  const closeForm = () => {
    setIsRightAsideExpanded(false);
    setEditContact(undefined);
  };

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoContacts />} isGlobal>
        <SideBarBreadcrumbsItem href="/contacts">
          Contacts
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      {isRightAsideExpanded && (
        <ContactForm
          input={editContact}
          onClose={closeForm}
          onDone={closeForm}
          isOpen={isRightAsideExpanded}
        />
      )}

      <SectionCard stack="vertical" variant="main">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Contacts"
            actions={
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
            }
          />
          <SectionCardBody>
            {contacts.length > 0 ? (
              <CompactTable
                fields={[
                  { label: 'Name', key: 'name', width: '15%' },
                  { label: 'Email', key: 'email', width: '35%' },
                  {
                    label: 'Address',
                    key: 'account.address',
                    width: '50%',
                    render: CompactTableFormatters.FormatAccount({
                      headLength: 15,
                      tailLength: 15,
                    }),
                  },
                  {
                    label: '',
                    key: '',
                    width: '10%',
                    render: CompactTableFormatters.FormatContextMenu([
                      {
                        label: 'Edit',
                        trigger: (value) => {
                          setIsRightAsideExpanded(true);
                          setEditContact(value);
                        },
                      },
                      {
                        label: 'Delete',
                        trigger: async (value) => {
                          const confirm = await prompt((resolve, reject) => {
                            return (
                              <ConfirmDeletion
                                onCancel={() => reject()}
                                onDelete={() => resolve(true)}
                                title="Delete Contact"
                                description="Are you sure you want to delete this contact?"
                              />
                            );
                          });
                          if (confirm) {
                            await contactRepository.deleteContact(value.uuid);
                          }
                        },
                      },
                    ]),
                  },
                ]}
                data={contacts}
                variant="open"
              />
            ) : (
              <Notification
                intent="info"
                isDismissable={false}
                role="alert"
                type="inlineStacked"
              >
                <NotificationHeading>
                  No contacts created yet
                </NotificationHeading>
              </Notification>
            )}
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
}
