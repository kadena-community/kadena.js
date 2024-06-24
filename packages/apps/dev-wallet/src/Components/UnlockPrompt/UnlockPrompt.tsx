import {
  Button,
  Dialog,
  Heading,
  Stack,
  Text,
  TextField,
} from '@kadena/react-ui';
import React from 'react';
import { unlockPrompt } from './style.css.ts';

export const UnlockPrompt: React.FC<{
  resolve: (pass: string) => void;
  reject: () => void;
}> = ({ resolve, reject }) => (
  <Dialog isOpen={true} className={unlockPrompt}>
    <form
      onSubmit={(event) => {
        const formData = new FormData(event.target as HTMLFormElement);
        resolve(formData.get('password') as string);
      }}
    >
      <Stack flexDirection={'column'} gap={'md'}>
        <Heading>Unlock hd-wallet</Heading>
        <Text>
          You need to unlock the hd-wallet key source in order to use it for
          sign or account creation
        </Text>
        <TextField name="password" type="password" />
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
