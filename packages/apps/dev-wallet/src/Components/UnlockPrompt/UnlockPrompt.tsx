import { IProfile } from '@/modules/wallet/wallet.repository.ts';
import { PasswordKeepPolicy } from '@/service-worker/types.ts';
import { getErrorMessage } from '@/utils/getErrorMessage.ts';
import {
  Button,
  Dialog,
  Heading,
  Notification,
  Radio,
  RadioGroup,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { unlockPrompt } from './style.css.ts';

export const UnlockPrompt: React.FC<{
  showPassword?: boolean;
  rememberPassword?: IProfile['options']['rememberPassword'];
  profile: IProfile;
  resolve: ({
    password,
    keepOpen,
  }: {
    password: string;
    keepOpen: PasswordKeepPolicy;
  }) => Promise<void>;
  reject: (reason: any) => void;
  storePassword?: boolean;
}> = ({
  resolve,
  reject,
  showPassword,
  rememberPassword,
  profile,
  storePassword = true,
}) => {
  const [error, setError] = useState<string>();
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      keepOpen: rememberPassword || 'session',
      password: '',
    },
  });
  return (
    <Dialog
      size="sm"
      isOpen={true}
      className={unlockPrompt}
      onOpenChange={(isOpen) => reject(isOpen)}
    >
      <form
        onSubmit={handleSubmit((data) => {
          resolve(data).catch((e) => {
            setError(getErrorMessage(e, 'Password in not correct'));
          });
        })}
      >
        <Stack flexDirection={'column'} gap={'md'}>
          <Heading>Unlock Security Module</Heading>
          <Text>
            You need to unlock the security module in order to use it for
            sensitive actions (e.g. sign or account creation)
          </Text>
          <Text>
            Profile:{' '}
            <Text bold color="emphasize">
              {profile.name}
            </Text>
          </Text>
          {showPassword && (
            <TextField
              type="password"
              {...register('password')}
              label="Password"
            />
          )}
          {storePassword && (
            <Controller
              name="keepOpen"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Keep open"
                  direction={'column'}
                  defaultValue={rememberPassword || 'session'}
                  value={field.value}
                  onChange={(value) => {
                    console.log('value', value);
                    field.onChange(value);
                  }}
                >
                  <Radio value="on-login">
                    Unlock security module at login
                  </Radio>
                  <Radio value="session">Keep open during this session</Radio>
                  <Radio value="short-time">Lock after 5 minutes</Radio>
                  <Radio value="never">always ask</Radio>
                </RadioGroup>
              )}
            />
          )}
          {error && (
            <Notification intent="negative" role="alert">
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>{error}</Text>
                <Text>Please try again!</Text>
              </Stack>
            </Notification>
          )}
          <Stack gap={'sm'}>
            <Button variant="transparent" type="reset" onClick={reject}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Unlock
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
};
