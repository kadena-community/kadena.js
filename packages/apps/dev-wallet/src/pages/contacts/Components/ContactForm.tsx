import { AccountInput } from '@/Components/AccountInput/AccountInput';
import { isKeysetGuard } from '@/modules/account/guards';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import {
  contactRepository,
  IContact,
} from '@/modules/contact/contact.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { labelBoldClass } from '@/pages/transaction/components/style.css';
import { Button, Notification, Stack, Text, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IContactFormData {
  name: string;
  email: string;
  discoverdAccount?: IRetrievedAccount;
}

export function ContactForm({
  onClose,
  onDone,
  input,
  isOpen,
}: {
  input?: IContact;
  onClose: () => void;
  onDone: (contect: IContact) => void;
  isOpen: boolean;
}) {
  const { activeNetwork } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>(input?.account.address ?? '');
  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<IContactFormData>({
    defaultValues: input ?? {
      name: '',
      email: '',
      discoverdAccount: undefined,
    },
  });

  useEffect(() => {
    reset({ ...input, discoverdAccount: undefined });
  }, [input, reset]);

  const createContact = async ({
    discoverdAccount,
    ...data
  }: IContactFormData) => {
    if (!discoverdAccount) {
      setError('Please select an account');
      return;
    }
    if (!isKeysetGuard(discoverdAccount.guard)) {
      setError('only Keyset is valid for contact');
      return;
    }
    const account: IContact['account'] = {
      address: discoverdAccount.address,
      guard: discoverdAccount.guard,
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
  };

  if (!activeNetwork) return null;

  return (
    <RightAside isOpen={isOpen}>
      <form onSubmit={handleSubmit(createContact)}>
        <RightAsideHeader
          label={input?.uuid ? 'Edit Contact' : 'Add Contact'}
        />
        <RightAsideContent>
          <Stack width="100%" flexDirection="column" gap="md">
            <TextField
              aria-label="Name"
              label="Name"
              defaultValue={getValues('name')}
              {...register('name', { required: true })}
            />
            <TextField
              aria-label="Email"
              label="Email (optional)"
              defaultValue={getValues('email')}
              {...register('email')}
            />

            <Stack flexDirection={'column'} gap={'sm'} marginBlockStart={'lg'}>
              <Stack gap="sm" alignItems={'center'}>
                <Text className={labelBoldClass}>KDA Account</Text>
              </Stack>
              <Controller
                name="discoverdAccount"
                control={control}
                rules={{ required: true }}
                defaultValue={getValues('discoverdAccount')}
                render={({ field }) => {
                  return (
                    <Stack flexDirection={'column'} gap={'sm'}>
                      <AccountInput
                        address={address}
                        setAddress={setAddress}
                        account={field.value}
                        networkId={activeNetwork.networkId}
                        contract={'coin'}
                        onAccount={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </Stack>
                  );
                }}
              />
            </Stack>
            {error && (
              <Notification intent="negative" role="alert">
                {error}
              </Notification>
            )}
          </Stack>
        </RightAsideContent>
        <RightAsideFooter>
          <Button onClick={onClose} type="reset" variant="transparent">
            Cancel
          </Button>
          <Button type="submit" isDisabled={!isValid}>
            Save
          </Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
}
