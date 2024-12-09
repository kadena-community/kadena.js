import { Key } from '@/Components/Key/Key';
import {
  accountRepository,
  IKeySet,
} from '@/modules/account/account.repository';
import { isKeysetGuard } from '@/modules/account/guards';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { MonoAdd, MonoDelete, MonoKey } from '@kadena/kode-icons/system';
import {
  Badge,
  Button,
  Combobox,
  ComboboxItem,
  Heading,
  Notification,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { keyColumnClass, keyItemClass } from './style.css';

interface IKeysetForm {
  existingKey: string;
  externalKey: string;
  contactKey: string;
  predicate: BuiltInPredicate;
  alias: string;
}

export function CreateKeySetForm({
  close,
  onDone,
  isOpen,
}: {
  close: () => void;
  onDone?: (keyset: IKeySet) => void;
  isOpen: boolean;
}) {
  const { register, control, getValues, setValue, handleSubmit } =
    useForm<IKeysetForm>({
      defaultValues: {
        existingKey: '',
        externalKey: '',
        contactKey: '',
        predicate: 'keys-all',
        alias: '',
      },
    });
  const [error, setError] = useState<string | null>(null);
  const { keySources, createKey, profile, keysets, contacts } = useWallet();

  const flattenKeys = keySources
    .map((keySource) => keySource.keys.map((key) => ({ key, keySource })))
    .flat();

  const flattenContactKeys =
    contacts
      // TODO: use keysetRef guard as well
      .filter((contact) => isKeysetGuard(contact.account.guard))
      .map((contact) =>
        isKeysetGuard(contact.account.guard)
          ? contact.account.guard.keys.map((key) => ({ key, contact }))
          : [],
      )
      .flat() ?? [];
  const [addedKeys, setAddedKeys] = useState<string[]>([]);
  const addKey = (key: string) => {
    if (addedKeys.includes(key)) return;
    setAddedKeys([key, ...addedKeys]);
  };

  async function createKeySet(data: IKeysetForm) {
    try {
      if (!profile) {
        throw new Error('No profile found');
      }
      const principal = await createPrincipal(
        {
          keyset: {
            keys: addedKeys,
            pred: data.predicate,
          },
        },
        {},
      );
      const keyset: IKeySet = {
        alias: data.alias,
        guard: {
          keys: addedKeys,
          pred: data.predicate,
        },
        principal: principal,
        uuid: crypto.randomUUID(),
        profileId: profile?.uuid,
      };

      if (keysets.find((k) => k.principal === keyset.principal)) {
        throw new Error(
          `this keyset already exists. You can only have one keyset with the same keys. principal: ${keyset.principal}`,
        );
      }

      await accountRepository.addKeyset(keyset);
      onDone && onDone(keyset);
    } catch (e: any) {
      if (!e) {
        setError('Unknown error');
      }
      setError(e && 'message' in e ? e.message : JSON.stringify(e));
      throw e;
    }
    close();
  }

  return (
    <RightAside isOpen={isOpen}>
      <form onSubmit={handleSubmit(createKeySet)}>
        <RightAsideHeader label="Add keys to keyset" />
        <RightAsideContent>
          <Stack width="100%" flexDirection="column" gap="md">
            <Stack flexDirection={'column'} gap={'lg'} flex={1}>
              <Heading variant="h5">
                Add keys to the keyset by using the following options
              </Heading>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Heading variant="h6">Choose from your existing keys</Heading>
                <Stack gap={'sm'}>
                  <Controller
                    name="existingKey"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Combobox
                          inputValue={field.value}
                          onInputChange={(val) => {
                            field.onChange(val);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addKey(getValues('existingKey'));
                              setValue('existingKey', '');
                            }
                          }}
                        >
                          {flattenKeys.map(({ key, keySource }) => (
                            <ComboboxItem
                              key={key.publicKey}
                              textValue={key.publicKey}
                            >
                              <Stack
                                gap={'sm'}
                                justifyContent={'space-between'}
                              >
                                <Stack gap={'sm'}>
                                  <Text color="inherit">
                                    <MonoKey />
                                  </Text>
                                  <Text color="inherit">
                                    {shorten(key.publicKey, 12)}
                                  </Text>
                                </Stack>
                                <Stack gap={'sm'}>
                                  <Badge size="sm">{keySource.source}</Badge>
                                  <Text color="inherit">
                                    {key.index !== undefined
                                      ? shorten(key.index.toString())
                                      : ''}
                                  </Text>
                                </Stack>
                              </Stack>
                            </ComboboxItem>
                          ))}
                        </Combobox>
                        <Button
                          variant="outlined"
                          onPress={() => {
                            addKey(getValues('existingKey'));
                            setValue('existingKey', '');
                          }}
                          isDisabled={!field.value}
                        >
                          <MonoAdd />
                        </Button>
                      </>
                    )}
                  />
                </Stack>
              </Stack>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Heading variant="h6">Choose from your contacts keys</Heading>
                <Stack gap={'sm'}>
                  <Controller
                    name="contactKey"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Combobox
                          inputValue={field.value}
                          onInputChange={(val) => {
                            field.onChange(val);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addKey(getValues('contactKey'));
                              setValue('contactKey', '');
                            }
                          }}
                        >
                          {flattenContactKeys.map(({ key, contact }) => (
                            <ComboboxItem key={key} textValue={key}>
                              <Stack
                                gap={'sm'}
                                justifyContent={'space-between'}
                              >
                                <Stack gap={'sm'}>
                                  <Text color="inherit">
                                    <MonoKey />
                                  </Text>
                                  <Text color="inherit">
                                    {shorten(key, 12)}
                                  </Text>
                                </Stack>
                                <Stack gap={'sm'}>
                                  <Badge size="sm">{contact.name}</Badge>
                                </Stack>
                              </Stack>
                            </ComboboxItem>
                          ))}
                        </Combobox>
                        <Button
                          variant="outlined"
                          onPress={() => {
                            addKey(getValues('contactKey'));
                            setValue('contactKey', '');
                          }}
                          isDisabled={!field.value}
                        >
                          <MonoAdd />
                        </Button>
                      </>
                    )}
                  />
                </Stack>
              </Stack>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Heading variant="h6">Add external public key</Heading>
                <Stack gap={'sm'}>
                  <Controller
                    name="externalKey"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addKey(getValues('externalKey'));
                              setValue('externalKey', '');
                            }
                          }}
                        />
                        <Button
                          variant="outlined"
                          onPress={() => {
                            addKey(getValues('externalKey'));
                            setValue('externalKey', '');
                          }}
                          isDisabled={!field.value}
                        >
                          <MonoAdd />
                        </Button>
                      </>
                    )}
                  />
                </Stack>
              </Stack>
              <Stack flexDirection={'column'} gap={'md'}>
                <Heading variant="h6">Create new key from sources</Heading>
                <Stack gap={'sm'}>
                  {keySources.map((keySource) => (
                    <Button
                      key={keySource.uuid}
                      variant="outlined"
                      isCompact
                      onPress={async () => {
                        const key = await createKey(keySource);
                        addKey(key.publicKey);
                      }}
                    >
                      {keySource.source}
                    </Button>
                  ))}
                </Stack>
              </Stack>
              <Stack flexDirection={'column'} gap={'xl'}>
                <Stack flexDirection={'column'} gap={'sm'}>
                  <TextField label={'Alias'} {...register('alias')} />
                  <Text size="small">
                    this will be used to identify the keyset in the wallet
                  </Text>
                </Stack>
                <Stack flexDirection={'column'} gap={'sm'}>
                  <Controller
                    control={control}
                    name="predicate"
                    render={({ field }) => (
                      <Select
                        label={'Predicate'}
                        selectedKey={field.value}
                        onSelectionChange={(val) => {
                          field.onChange(val);
                        }}
                      >
                        <SelectItem key="keys-all" textValue="keys-all">
                          keys-all
                        </SelectItem>
                        <SelectItem key="keys-any" textValue="keys-any">
                          keys-any
                        </SelectItem>
                        <SelectItem key="keys-2" textValue="keys-2">
                          keys-2
                        </SelectItem>
                      </Select>
                    )}
                  />
                  <Text size="small">
                    The predicate method defines how many keys are required for
                    the transaction that uses this keyset.
                  </Text>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              flexDirection={'column'}
              gap={'md'}
              className={keyColumnClass}
              overflow="auto"
            >
              <Heading variant="h5">
                These keys will be added to the keyset
              </Heading>

              {addedKeys.length > 0 && (
                <Text>You can remove keys by clicking on the delete icon</Text>
              )}

              {addedKeys.length === 0 && (
                <Text>
                  No keys added yet, Add keys via one of the above methods
                </Text>
              )}
              <Stack gap={'sm'} flexDirection={'column'}>
                {addedKeys.map((key) => (
                  <Stack
                    key={key}
                    gap={'sm'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    className={keyItemClass}
                  >
                    <Key publicKey={key} shortening={20} />
                    <Button
                      variant="transparent"
                      onPress={() => {
                        setAddedKeys(addedKeys.filter((k) => k !== key));
                      }}
                    >
                      <MonoDelete />
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
          <Stack width="100%" flex={1} flexDirection={'column'}>
            {error && (
              <Stack>
                <Notification intent="negative" role="alert">
                  {error}
                </Notification>
              </Stack>
            )}
            <Stack
              justifyContent={'space-between'}
              gap={'md'}
              marginBlockStart={'lg'}
            >
              {addedKeys.length < 2 && 'At least 2 keys are required'}
              {addedKeys.length >= 2 && `Selected Keys: ${addedKeys.length}`}
            </Stack>
          </Stack>
        </RightAsideContent>

        <RightAsideFooter>
          <Button variant="outlined" onPress={() => close()} type="reset">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isDisabled={addedKeys.length < 2}
          >
            Save
          </Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
}
