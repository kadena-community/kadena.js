import { IKeySet } from '@/modules/account/account.repository';
import { isKeysetGuard } from '@/modules/account/guards';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { Badge, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useMemo } from 'react';
import { ButtonItem } from '../ButtonItem/ButtonItem';
import { ComboField } from '../ComboField/ComboField';
import { Keyset } from '../Guard/keyset';
import { Key } from '../Key/Key';

export interface IKey {
  publicKey: string;
  id: string;
  source: string;
}

export function KeySearchBox({
  onSelect,
}: {
  onSelect: (key: IKey | IKeySet) => void;
}) {
  const { keySources, contacts, createKey, keysets } = useWallet();
  const keys: IKey[] = useMemo(() => {
    const keysFromKeySources = keySources
      .map((keySource) => {
        return keySource.keys.map((key) => ({
          publicKey: key.publicKey,
          id: key.index?.toString() ?? '',
          source: keySource.source,
        }));
      })
      .flat();

    return keysFromKeySources;
  }, [keySources]);

  const contactKeys: IKey[] = useMemo(() => {
    const keysFromContacts = contacts
      .map((contact) => {
        if (!isKeysetGuard(contact.account.guard)) return [];
        return contact.account.guard.keys.map((key) => ({
          publicKey: key,
          id: '',
          source: contact.name,
        }));
      })
      .flat();

    return keysFromContacts;
  }, [contacts]);

  return (
    <Stack flex={1}>
      <ComboField
        placeholder="Select or Enter a public key"
        onSubmit={(value) => {
          onSelect({
            publicKey: value,
            id: '',
            source: 'input',
          });
        }}
      >
        {({ value: search, close }) => {
          const filteredKeys = keys.filter(filterKey(search));
          const filteredContacts = contactKeys.filter(filterKey(search));
          const filteredKeysets = keysets
            .filter(({ guard }) => guard.keys.length > 1)
            .filter(filterKeySet(search));
          return (
            <Stack flexDirection={'column'} gap={'md'} padding={'sm'}>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Stack
                  gap={'sm'}
                  flexDirection={'column'}
                  justifyContent={'space-between'}
                >
                  <Heading variant={'h6'}>Your Keys</Heading>
                </Stack>
                <Stack gap={'sm'}>
                  {keySources.map((keySource) => (
                    <Button
                      variant="outlined"
                      isCompact
                      key={keySource.source}
                      onClick={async () => {
                        const key = await createKey(keySource);
                        onSelect({
                          publicKey: key.publicKey,
                          id: key.index?.toString() ?? '',
                          source: keySource.source,
                        });
                        close();
                      }}
                    >
                      {`+ ${keySource.source}`}
                    </Button>
                  ))}
                </Stack>

                {filteredKeys.length > 0 && (
                  <Stack flexDirection={'column'}>
                    {filteredKeys.map((key) => (
                      <ButtonItem
                        onClick={() => {
                          onSelect(key);
                          close();
                        }}
                      >
                        <KeyItem keyItem={key} key={key.publicKey} />
                      </ButtonItem>
                    ))}
                  </Stack>
                )}
              </Stack>

              {filteredContacts.length > 0 && (
                <Stack flexDirection={'column'} gap={'sm'}>
                  <Heading variant={'h6'}>Your Contacts</Heading>
                  <Stack flexDirection={'column'}>
                    {filteredContacts.map((key) => (
                      <ButtonItem
                        onClick={() => {
                          onSelect(key);
                          close();
                        }}
                      >
                        <KeyItem keyItem={{ ...key }} key={key.publicKey} />
                      </ButtonItem>
                    ))}
                  </Stack>
                </Stack>
              )}
              {filteredKeysets.length > 0 && (
                <Stack flexDirection={'column'} gap={'sm'}>
                  <Heading variant={'h6'}>Your Keysets</Heading>
                  <Stack flexDirection={'column'}>
                    {filteredKeysets.map((keySet) => (
                      <ButtonItem
                        onClick={() => {
                          onSelect(keySet);
                          close();
                        }}
                      >
                        <Keyset
                          alias={keySet.alias}
                          guard={{
                            ...keySet.guard,
                            principal: keySet.principal,
                          }}
                        />
                      </ButtonItem>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          );
        }}
      </ComboField>
    </Stack>
  );
}

const KeyItem = ({ keyItem }: { keyItem: IKey }) => (
  <Stack gap={'sm'} alignItems={'center'} justifyContent={'space-between'}>
    <Key publicKey={keyItem.publicKey} shortening={10} />
    <Stack gap={'xs'} alignItems={'center'}>
      {keyItem.source && <Badge size="sm">{keyItem.source}</Badge>}
      <Text>{shorten(keyItem.id)}</Text>
    </Stack>
  </Stack>
);

const filterKey = (search: string) => (key: IKey) =>
  key.publicKey.includes(search) ||
  key.id.includes(search) ||
  key.source.includes(search);

const filterKeySet = (search: string) => (keySet: IKeySet) =>
  keySet.principal.includes(search) ||
  keySet.alias?.includes(search) ||
  keySet.guard.keys.filter((k) => k.includes(search)).length > 0;
