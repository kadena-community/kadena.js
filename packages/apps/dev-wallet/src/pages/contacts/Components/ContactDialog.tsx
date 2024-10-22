import { AccountInput } from '@/Components/AccountInput/AccountInput';
import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { displayContentsClass } from '@/Components/Sidebar/style.css';
import {
  contactRepository,
  IContact,
} from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { labelBoldClass } from '@/pages/transaction/components/style.css';
import { IReceiverAccount } from '@/pages/transfer/utils';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Notification,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IContactFormData {
  name: string;
  email: string;
  discoverdAccount?: IReceiverAccount;
}

export function ContactDialog({
  onClose,
  onDone,
  input,
}: {
  input?: IContact;
  onClose: () => void;
  onDone: (contect: IContact) => void;
}) {
  const prompt = usePrompt();
  const { activeNetwork } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<IContactFormData>({
    defaultValues: input ?? {
      name: '',
      email: '',
      discoverdAccount: undefined,
    },
  });

  const createContact = useCallback(
    async ({ discoverdAccount, ...data }: IContactFormData) => {
      if (!discoverdAccount) {
        setError('Please select an account');
        return;
      }
      const account: IContact['account'] = {
        address: discoverdAccount.address,
        contract: 'coin',
        keyset: {
          keys: discoverdAccount.keyset.guard.keys.map((item) =>
            typeof item === 'string' ? item : item.pubKey,
          ),
          pred: discoverdAccount.keyset.guard.pred,
        },
        networkUUID: activeNetwork!.uuid,
      };
      const contact = {
        ...data,
        account,
        uuid: input?.uuid ?? crypto.randomUUID(),
      };
      try {
        if (contact.name && contact.account) {
          if (input?.uuid) {
            await contactRepository.updateContact(contact);
          } else {
            await contactRepository.addContact(contact);
          }
          onDone(contact);
        }
      } catch (e: any) {
        setError((e && e.message) || JSON.stringify(e));
        console.error(e);
      }
    },
    [activeNetwork, input?.uuid, onDone],
  );

  if (!activeNetwork) return null;

  return (
    <>
      <Dialog
        isOpen={true}
        size="sm"
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <form
          className={displayContentsClass}
          onSubmit={handleSubmit(createContact)}
        >
          <DialogHeader>{input ? 'Edit Contact' : 'Add Contact'}</DialogHeader>
          <DialogContent>
            <Stack gap={'lg'} flexDirection={'column'}>
              <TextField
                label="Name"
                defaultValue={getValues('name')}
                {...register('name', { required: true })}
              />
              <TextField
                label="Email (optional)"
                defaultValue={getValues('email')}
                {...register('email')}
              />

              <Stack
                flexDirection={'column'}
                gap={'sm'}
                marginBlockStart={'lg'}
              >
                <Stack gap="sm" alignItems={'center'}>
                  <Text className={labelBoldClass}>KDA Account</Text>
                </Stack>
                <Controller
                  name="discoverdAccount"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Stack flexDirection={'column'} gap={'sm'}>
                      <AccountInput
                        account={field.value}
                        networkId={activeNetwork.networkId}
                        contract={'coin'}
                        onAccount={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </Stack>
                  )}
                />
              </Stack>
              {error && (
                <Notification intent="negative" role="alert">
                  {error}
                </Notification>
              )}
            </Stack>
          </DialogContent>
          <DialogFooter>
            <Stack flex={1}>
              <Stack flex={1}>
                {input?.uuid && (
                  <Button
                    type="button"
                    variant="negative"
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
                        await contactRepository.deleteContact(input.uuid);
                        onClose();
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
              <Stack>
                <Button onClick={onClose} type="reset" variant="transparent">
                  Cancel
                </Button>
                <Button type="submit" isDisabled={!isValid}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
