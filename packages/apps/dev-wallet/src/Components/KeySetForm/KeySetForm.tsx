import { useRightAside } from '@/App/Layout/useRightAside';
import { Key } from '@/Components/Key/Key';
import { displayContentsClass } from '@/Components/Sidebar/style.css';
import { IKeySet, IKeysetGuard } from '@/modules/account/account.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { MonoDelete } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Select,
  SelectItem,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { RightAside } from '@kadena/kode-ui/patterns';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeySearchBox } from '../KeySearchBox/KeySearchBox';
import { ListItem } from '../ListItem/ListItem';
import { KeysetList } from './keyset-list';

interface IKeysetForm {
  publicKey: string;
  predicate: BuiltInPredicate;
}

export function KeySetForm({
  isOpen,
  close,
  onChange,
  keyset,
  variant = 'dialog',
  LiveForm = false,
  filteredKeysets = [],
}: {
  isOpen: boolean;
  close: () => void;
  onChange: (keyset?: IKeysetGuard & { alias?: string }) => void;
  keyset?: IKeysetGuard;
  variant?: 'dialog' | 'inline';
  LiveForm?: boolean;
  filteredKeysets?: Array<IKeySet & { used: boolean }>;
}) {
  const { control, getValues, setValue, handleSubmit } = useForm<IKeysetForm>({
    defaultValues: {
      publicKey: '',
      predicate: 'keys-all',
    },
  });

  const [isKeysetListExpanded, expandKeysetList, closeKeysetList] =
    useRightAside();

  useEffect(() => {
    if (keyset) {
      setAddedKeys(keyset.keys);
      setValue('predicate', keyset.pred);
    }
  }, [keyset]);

  const [pending, setPending] = useState(false);

  const [addedKeys, setAddedKeys] = useState<string[]>([]);
  const newKeyList = (key: string) => {
    if (addedKeys.includes(key)) return addedKeys;
    return [key, ...addedKeys];
  };

  async function onSubmit(data: IKeysetForm, keys = addedKeys) {
    if (!keys.length) {
      onChange(undefined);
      return;
    }
    setPending(true);
    const principal = await createPrincipal(
      {
        keyset: {
          keys: keys,
          pred: data.predicate,
        },
      },
      {},
    );
    onChange({
      keys: keys,
      pred: data.predicate,
      principal,
    });
    setPending(false);
  }

  const Content: FC<PropsWithChildren> = ({ children }) => {
    if (variant === 'dialog') {
      return (
        <Dialog
          isOpen={isOpen}
          size="sm"
          onOpenChange={(open) => {
            if (!open) {
              close();
            }
          }}
        >
          {children}
        </Dialog>
      );
    }
    return <Stack flexDirection={'column'}>{children}</Stack>;
  };

  return (
    <Content>
      <RightAside isOpen={isKeysetListExpanded}>
        <KeysetList
          keysets={filteredKeysets}
          flexDirection={'column'}
          onSelect={(keyset) => {
            onChange({
              ...keyset.guard,
              principal: keyset.principal,
              alias: keyset.alias,
            });
            closeKeysetList();
          }}
        />
      </RightAside>
      <form
        className={displayContentsClass}
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        {variant === 'dialog' && <DialogHeader>Create Key Set</DialogHeader>}
        <DialogContent>
          <Stack flexDirection={'column'} gap={'xxxl'}>
            <Stack flexDirection={'column'} gap={'lg'}>
              <Stack flexDirection={'column'} gap={'sm'} flex={1}>
                <Stack
                  justifyContent={'space-between'}
                  gap={'sm'}
                  alignItems={'center'}
                >
                  <Label bold>Key</Label>
                  {variant === 'inline' && (
                    <Button
                      isCompact
                      variant="outlined"
                      onClick={() => expandKeysetList()}
                    >
                      existing keysets
                    </Button>
                  )}
                </Stack>
                <Stack gap={'sm'}>
                  <Controller
                    name="publicKey"
                    control={control}
                    render={() => (
                      <>
                        <KeySearchBox
                          onSelect={(data) => {
                            const keys = newKeyList(data.publicKey);
                            setAddedKeys(keys);
                            setValue('publicKey', '');
                            if (LiveForm) {
                              onSubmit(getValues(), keys);
                            }
                          }}
                        />
                      </>
                    )}
                  />
                </Stack>
                <Stack flexDirection={'column'}>
                  {addedKeys.length === 0 && (
                    <Stack marginBlock={'sm'}>
                      <Text size="smallest">No keys added yet!</Text>
                    </Stack>
                  )}
                  {addedKeys.map((key) => (
                    <ListItem key={key}>
                      <Stack
                        key={key}
                        flex={1}
                        gap={'sm'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Key publicKey={key} shortening={20} />
                        <Button
                          variant="transparent"
                          isCompact
                          onPress={() => {
                            const updatedKeys = addedKeys.filter(
                              (k) => k !== key,
                            );
                            setAddedKeys(addedKeys.filter((k) => k !== key));
                            if (LiveForm) {
                              onSubmit(getValues(), updatedKeys);
                            }
                          }}
                        >
                          <MonoDelete />
                        </Button>
                      </Stack>
                    </ListItem>
                  ))}
                </Stack>
                <Stack flexDirection={'column'} gap={'sm'} flex={1}>
                  <Controller
                    control={control}
                    name="predicate"
                    render={({ field }) => (
                      <Select
                        label={'Predicate'}
                        selectedKey={field.value}
                        onSelectionChange={(val) => {
                          field.onChange(val);
                          if (LiveForm) {
                            onSubmit(getValues());
                          }
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
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        {!LiveForm && (
          <DialogFooter>
            <Stack width="100%" flex={1} flexDirection={'column'}>
              <Stack justifyContent={'space-between'} gap={'md'}>
                <Stack
                  gap={'md'}
                  justifyContent={'flex-end'}
                  alignItems={'flex-end'}
                >
                  <Button
                    variant="outlined"
                    onPress={() => close()}
                    type="reset"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    isDisabled={addedKeys.length < 1 || pending}
                    isLoading={pending}
                  >
                    Confirm
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </DialogFooter>
        )}
      </form>
    </Content>
  );
}
