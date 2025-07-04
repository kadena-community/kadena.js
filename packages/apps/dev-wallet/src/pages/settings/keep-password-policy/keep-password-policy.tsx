import { useWallet } from '@/modules/wallet/wallet.hook';
import { walletRepository } from '@/modules/wallet/wallet.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { successClass } from '@/pages/transaction/components/style.css';
import { PasswordKeepPolicy } from '@/service-worker/types';
import {
  MonoRadioButtonChecked,
  MonoRadioButtonUnchecked,
} from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { useState } from 'react';

export function KeepPasswordPolicy() {
  const { profile } = useWallet();
  const [updated, setUpdated] = useState(false);
  if (!profile) {
    return null;
  }
  const checkBox = (mode: PasswordKeepPolicy) => {
    return profile.options.rememberPassword === mode ? (
      <MonoRadioButtonChecked className={successClass} />
    ) : (
      <MonoRadioButtonUnchecked />
    );
  };
  const onChange = (mode: PasswordKeepPolicy) => async () => {
    profile.options.rememberPassword = mode;
    await walletRepository.patchProfile(profile.uuid, {
      options: { ...profile.options, rememberPassword: mode },
    });
    setUpdated(true);
  };

  const buttonProps = (mode: PasswordKeepPolicy) => ({
    onClick: onChange(mode),
    startVisual: checkBox(mode),
    variant: 'transparent' as const,
    className: profile.options.rememberPassword === mode ? successClass : '',
  });
  return (
    <Stack flexDirection={'column'} gap={'sm'} alignItems={'flex-start'}>
      <Stack
        paddingInlineStart={'md'}
        flexDirection={'column'}
        gap={'sm'}
        marginBlockEnd={'lg'}
      >
        <Heading variant="h3">Unlock Security Module</Heading>
        <Text size="small">
          To perform sensitive actions (such as signing transactions or creating
          accounts), you need to unlock the security module.
        </Text>
      </Stack>
      <Stack
        paddingInlineStart={'md'}
        flexDirection={'column'}
        gap={'sm'}
        marginBlockEnd={'sm'}
      >
        <Label bold>When should we ask for your password or biometrics?</Label>
      </Stack>
      <Button {...buttonProps('on-login')}>Never (disabled)</Button>
      <Button {...buttonProps('session')}>Only once per session</Button>
      <Button {...buttonProps('short-time')}>
        Every 5 minutes of inactivity
      </Button>
      <Button {...buttonProps('never')}>Always ask</Button>
      {updated && (
        <Stack
          paddingInlineStart={'md'}
          flexDirection={'column'}
          gap={'sm'}
          marginBlockEnd={'lg'}
        >
          <Notification role="none" intent="info">
            You need to log out to apply the change
          </Notification>
        </Stack>
      )}
    </Stack>
  );
}
