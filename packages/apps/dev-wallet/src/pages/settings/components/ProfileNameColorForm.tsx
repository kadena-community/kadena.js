import { config } from '@/config';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { walletRepository } from '@/modules/wallet/wallet.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { MonoCheck } from '@kadena/kode-icons/system';
import { Button, Notification, Stack, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ProfileForm {
  name: string;
  color: string;
}

export function ProfileNameColorForm({ isOpen }: { isOpen: boolean }) {
  const { profile } = useWallet();
  const { register, handleSubmit, control } = useForm<ProfileForm>({
    defaultValues: {
      name: profile?.name ?? '',
      color: profile?.accentColor ?? '',
    },
  });

  const { setIsRightAsideExpanded } = useSideBarLayout();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: ProfileForm) {
    const { name, color } = data;
    setError(null);
    await walletRepository.updateProfile({
      ...profile!,
      name,
      accentColor: color,
    });
    setIsRightAsideExpanded(false);
  }

  return (
    <RightAside isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RightAsideHeader label="Profile Name and Color" />
        <RightAsideContent>
          <Stack width="100%" flexDirection="column" gap="md">
            <TextField
              autoFocus
              label="Profile Name"
              placeholder="Enter profile name"
              defaultValue={profile?.name}
              {...register('name', { required: true })}
            />
            <Label size="small" bold>
              Accent Color
            </Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <Stack gap="sm" flexWrap="wrap">
                  {config.colorList.map((color) => (
                    <Button
                      key={color}
                      variant="outlined"
                      onPress={() => field.onChange(color)}
                      style={{
                        backgroundColor: color,
                        color: 'white',
                        borderRadius: 50,
                      }}
                    >
                      <div style={{ width: 25, height: 25 }}>
                        {field.value === color ? <MonoCheck /> : null}
                      </div>
                    </Button>
                  ))}
                </Stack>
              )}
            ></Controller>
            {error && <Notification role="alert">{error}</Notification>}
          </Stack>
        </RightAsideContent>
        <RightAsideFooter>
          <Button
            variant="outlined"
            onPress={() => {
              setIsRightAsideExpanded(false);
            }}
            type="reset"
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
}
