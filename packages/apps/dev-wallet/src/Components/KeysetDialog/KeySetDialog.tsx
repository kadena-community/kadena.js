import { Key } from '@/Components/Key/Key';
import { displayContentsClass } from '@/Components/Sidebar/style.css';
import { IKeySet } from '@/modules/account/account.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons/system';
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
  TextField,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ListItem } from '../ListItem/ListItem';

interface IKeysetForm {
  existingKey: string;
  externalKey: string;
  contactKey: string;
  predicate: BuiltInPredicate;
  alias: string;
}

export function KeySetDialog({
  isOpen,
  close,
  onDone,
}: {
  isOpen: boolean;
  close: () => void;
  onDone: (keyset: IKeySet['guard']) => void;
}) {
  const { control, getValues, setValue, handleSubmit } = useForm<IKeysetForm>({
    defaultValues: {
      externalKey: '',
      predicate: 'keys-all',
    },
  });

  const [addedKeys, setAddedKeys] = useState<string[]>([]);
  const addKey = (key: string) => {
    if (addedKeys.includes(key)) return;
    setAddedKeys([key, ...addedKeys]);
  };

  async function onSubmit(data: IKeysetForm) {
    onDone({
      keys: addedKeys,
      pred: data.predicate,
    });
  }

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
      <form className={displayContentsClass} onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>Create Key Set</DialogHeader>
        <DialogContent>
          <Stack flexDirection={'column'} gap={'xxxl'}>
            <Stack flexDirection={'column'} gap={'lg'}>
              <Stack flexDirection={'column'} gap={'sm'} flex={1}>
                <Label bold>External Key</Label>
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
                <Stack flexDirection={'column'}>
                  {addedKeys.length === 0 && <Text>No keys added yet!</Text>}
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
                            setAddedKeys(addedKeys.filter((k) => k !== key));
                          }}
                        >
                          <MonoDelete />
                        </Button>
                      </Stack>
                    </ListItem>
                  ))}
                </Stack>
              </Stack>
              <Stack flexDirection={'column'} gap={'xl'}></Stack>
            </Stack>
            <Stack flexDirection={'column'} gap={'md'} overflow="auto"></Stack>
          </Stack>
        </DialogContent>
        <DialogFooter>
          <Stack width="100%" flex={1} flexDirection={'column'}>
            <Stack
              justifyContent={'space-between'}
              gap={'md'}
              marginBlockStart={'lg'}
            >
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
              <Stack
                gap={'md'}
                justifyContent={'flex-end'}
                alignItems={'flex-end'}
              >
                <Button variant="outlined" onPress={() => close()} type="reset">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={addedKeys.length < 1}
                >
                  Confirm
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
