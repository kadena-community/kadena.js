import { useWallet } from '@/modules/wallet/wallet.hook';
import { walletRepository } from '@/modules/wallet/wallet.repository';
import { successClass } from '@/pages/transaction/components/style.css';
import { PasswordKeepPolicy } from '@/service-worker/types';
import {
  MonoRadioButtonChecked,
  MonoRadioButtonUnchecked,
} from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';

export function KeepPasswordPolicy() {
  const { profile } = useWallet();
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
  const onChange = (mode: PasswordKeepPolicy) => () => {
    profile.options.rememberPassword = mode;
    walletRepository.patchProfile(profile.uuid, {
      options: { ...profile.options, rememberPassword: mode },
    });
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
        <Heading variant="h3">Keep password policy</Heading>
        <Text size="small">You need to log out to apply the change</Text>
      </Stack>
      <Button {...buttonProps('on-login')}>Unlock at login</Button>
      <Button {...buttonProps('session')}>Ask once during a session</Button>
      <Button {...buttonProps('short-time')}>Ask each 5 minutes</Button>
      <Button {...buttonProps('never')}>Always ask for password</Button>
    </Stack>
  );
}
