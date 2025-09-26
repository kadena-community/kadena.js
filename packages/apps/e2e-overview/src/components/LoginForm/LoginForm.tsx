import { useUser } from '@/hooks/user';
import { Button, Stack } from '@kadena/kode-ui';

import type { FC } from 'react';

export const LoginForm: FC = () => {
  const { signInByGoogle } = useUser();

  return (
    <Stack flexDirection="column" gap="sm">
      <Button onPress={signInByGoogle}>sign in with google account</Button>
    </Stack>
  );
};
