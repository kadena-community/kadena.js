import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { ListItem } from '@/Components/ListItem/ListItem';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { contactRepository } from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { createAsideUrl } from '@/utils/createAsideUrl';
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
  Link as LinkUI,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { Link, useNavigate } from 'react-router-dom';
import { panelClass } from '../home/style.css';

export function Contacts() {
  const navigate = useNavigate();
  const { contacts } = useWallet();
  const prompt = usePrompt();

  return (
    <Stack flexDirection={'column'} className={panelClass} gap={'md'}>
      <Stack justifyContent={'space-between'}>
        <Heading variant="h3">Contacts</Heading>
        <Link to={createAsideUrl('AddContact')}>
          <LinkUI variant="outlined" isCompact>
            Add Contact
          </LinkUI>
        </Link>
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
                      navigate(
                        createAsideUrl('AddContact', {
                          contactId: contact.uuid,
                        }),
                      );
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
  );
}
