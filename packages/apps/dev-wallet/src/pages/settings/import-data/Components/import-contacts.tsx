import { KeySetForm } from '@/Components/KeySetForm/KeySetForm';
import { IGuard } from '@/modules/account/account.repository';
import { hasSameGuard } from '@/modules/account/account.service';
import { isKeysetGuard } from '@/modules/account/guards';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import {
  contactRepository,
  IContact,
} from '@/modules/contact/contact.repository';
import { UUID } from '@/modules/types';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  failureClass,
  pendingClass,
  successClass,
} from '@/pages/transaction/components/style.css';
import { AccountItem } from '@/pages/transfer/Components/AccountItem';
import { discoverReceiver } from '@/pages/transfer/utils';
import { createPrincipal } from '@kadena/client-utils/built-in';
import {
  MonoBackHand,
  MonoCheck,
  MonoLoading,
  MonoStop,
  MonoWarning,
} from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { useCallback, useEffect, useState } from 'react';
import { accountClass, needActionClass } from '../style.css';

const parseJSON = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
};

interface IImportedContact {
  uuid: UUID;
  name: string;
  email?: string;
  address: string;
  guard: IGuard;
  overallBalance?: string;
  verify:
    | 'pending'
    | 'verified'
    | 'several-accounts'
    | 'not-keyset'
    | 'not-found'
    | 'different-guard'
    | 'saved'
    | 'error';
  discoveredResult?: IRetrievedAccount[];
}

export function ImportContacts({
  content,
}: {
  content: {
    table: string;
    header: string[];
    data: string[][];
  };
}) {
  const { profile, activeNetwork } = useWallet();

  const updateItem = (index: number, data: IImportedContact) =>
    setImportedContacts((acc = []) => {
      const newAccounts = [...acc];
      newAccounts[index] = data;
      return newAccounts;
    });

  const [importedContacts, setImportedContacts] =
    useState<IImportedContact[]>();

  const profileId = profile?.uuid as UUID;
  const networkId = activeNetwork?.networkId as string;

  const importData = useCallback(
    async function importData() {
      if (!content || !networkId || !profileId) return;
      const { data } = content;
      const contacts: IImportedContact[] = data
        .map((row) => {
          const [name, email, address, guard] = row;

          return {
            uuid: crypto.randomUUID(),
            name,
            email,
            address,
            guard: parseJSON(guard),
            verify: 'pending' as const,
          };
        })
        .filter((contact) => contact.address);

      setImportedContacts(contacts);

      for (const [index, contact] of contacts.entries()) {
        const chainData = await discoverReceiver(
          contact.address,
          networkId,
          'coin',
        );
        contact.discoveredResult = chainData;
        console.log('chainData', chainData);
        if (!chainData.length) {
          if (isKeysetGuard(contact.guard)) {
            const principal = await createPrincipal(
              { keyset: contact.guard },
              {},
            );
            if (
              !contact.guard.principal ||
              contact.guard.principal === principal
            ) {
              contact.guard.principal = principal;
              contact.verify = 'verified';
            } else {
              contact.verify = 'not-found';
            }
          } else {
            contact.verify = 'not-found';
          }
        }
        if (chainData.length === 1) {
          if (
            !contact.guard ||
            !Object.keys(contact.guard).length ||
            hasSameGuard(contact.guard, chainData[0].guard)
          ) {
            contact.verify = 'verified';
            contact.guard = chainData[0].guard;
            contact.overallBalance = chainData[0].overallBalance;
            // TODO: we don't store this data in the contact; if we decide to add them we can use these data as well
            // contact.chains = chainData[0].chains;
          } else {
            contact.verify = 'different-guard';
          }
        }
        if (chainData.length > 1) {
          const correct = chainData.find((chain) =>
            hasSameGuard(contact.guard, chain.guard),
          );
          if (correct) {
            contact.verify = 'verified';
            contact.guard = correct.guard;
            contact.overallBalance = correct.overallBalance;
            // contact.chains = correct.chains;
          } else {
            contact.verify = 'several-accounts';
          }
        }

        updateItem(index, contact);
      }
    },
    [content, networkId, profileId],
  );

  useEffect(() => {
    importData();
  }, [importData]);

  if (!profileId || !networkId) {
    return (
      <Notification intent="negative" role="alert">
        Profile or network not found
      </Notification>
    );
  }

  const allVerified = importedContacts?.every(
    (account) => account.verify === 'verified',
  );

  function saveImportedContacts() {
    if (!importedContacts) return;
    const contacts: IContact[] = importedContacts
      .map((acc) => {
        const { name, email, address, guard, uuid } = acc;
        return {
          uuid,
          name,
          email,
          account: {
            address,
            guard,
          },
        };
      })
      .filter((acc) => acc) as IContact[];

    contacts.map((account, index) =>
      contactRepository
        .addContact(account)
        .then(() => {
          console.log('saved', account);
          importedContacts[index].verify = 'saved';
          updateItem(index, importedContacts[index]);
        })
        .catch(() => {
          console.log('error', account);
          importedContacts[index].verify = 'error';
          updateItem(index, importedContacts[index]);
        }),
    );
  }

  return (
    <Stack flexDirection={'column'} gap={'md'} alignItems={'flex-start'}>
      {!importedContacts && <Text>Loading...</Text>}
      {importedContacts && (
        <Stack gap="md" flexDirection={'column'}>
          <Heading variant="h5">Contacts to Discover</Heading>
          {allVerified && (
            <Notification intent="positive" role="status">
              All contact are verified you can now save them{' '}
            </Notification>
          )}
          {!allVerified && (
            <Text>
              Please wait till we verify the contacts guard with the blockchain
            </Text>
          )}

          <Stack gap={'sm'}>
            <Button isDisabled={!allVerified} onPress={saveImportedContacts}>
              Save
            </Button>
          </Stack>

          <Stack gap="xs" flexDirection={'column'}>
            {importedContacts.map((contact, index) => (
              <Stack
                flexDirection={'column'}
                gap={'sm'}
                key={contact.name}
                className={
                  contact.verify === 'several-accounts' ||
                  contact.verify === 'not-found'
                    ? needActionClass
                    : ''
                }
              >
                <Stack width="100%" gap={'sm'} alignItems={'center'}>
                  <Stack
                    flex={1}
                    className={accountClass}
                    paddingBlock={'xs'}
                    paddingInline={'md'}
                  >
                    <AccountItem
                      account={{
                        address: contact.address,
                        alias: contact.name,
                        overallBalance: contact.overallBalance ?? 'N/A',
                      }}
                      guard={contact.guard}
                    />
                  </Stack>

                  <Stack
                    style={{
                      minWidth: '90px',
                    }}
                    alignItems={'center'}
                  >
                    <Text size="small">
                      {contact.verify === 'pending' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoLoading /> Checking
                        </Stack>
                      )}
                      {contact.verify === 'verified' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={successClass}
                        >
                          <MonoCheck /> verified
                        </Stack>
                      )}
                      {contact.verify === 'several-accounts' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoBackHand /> Warning
                        </Stack>
                      )}
                      {contact.verify === 'not-found' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoWarning /> Not Found
                        </Stack>
                      )}
                      {contact.verify === 'different-guard' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={failureClass}
                        >
                          <MonoStop /> Different Guard
                        </Stack>
                      )}
                      {contact.verify === 'saved' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={successClass}
                        >
                          <MonoCheck /> Saved!
                        </Stack>
                      )}
                      {contact.verify === 'error' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoWarning /> Skipped (duplicate)
                        </Stack>
                      )}
                    </Text>
                  </Stack>
                </Stack>
                {contact.verify === 'several-accounts' && (
                  <Stack gap="xs" flexDirection={'column'}>
                    <Text>
                      {contact.discoveredResult?.length} accounts found with the
                      same address; select one of them.
                    </Text>
                    <Stack gap="xs" flexDirection={'column'}>
                      {contact.discoveredResult?.map((acc) => (
                        <Stack key={acc.address} gap={'xs'}>
                          <Stack
                            flex={1}
                            className={accountClass}
                            paddingBlock={'xs'}
                            paddingInline={'md'}
                          >
                            <AccountItem account={acc} guard={acc.guard} />
                          </Stack>
                          <Stack style={{ minWidth: '90px' }}>
                            <Button
                              isCompact
                              variant="outlined"
                              onClick={() => {
                                contact.guard = acc.guard;
                                contact.verify = 'verified';
                                contact.discoveredResult = [acc];
                                updateItem(index, contact);
                              }}
                            >
                              Select
                            </Button>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                )}
                {contact.verify === 'not-found' && (
                  <Stack gap="xs" flexDirection={'column'}>
                    <Text>
                      No account found with the address; please check the
                      address and try again.
                    </Text>
                    <Text>You can manually enter the guard and</Text>
                    <KeySetForm
                      isOpen
                      close={() => {}}
                      variant="inline"
                      onDone={(keyset) => {
                        contact.guard = keyset;
                        contact.verify = 'verified';
                        updateItem(index, contact);
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
