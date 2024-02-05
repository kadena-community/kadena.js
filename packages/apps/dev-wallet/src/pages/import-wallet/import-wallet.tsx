import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

type Inputs = {
  phrase: string;
  name: string;
  password: string;
};

const defaultValues: Inputs = {
  phrase: '',
  name: '',
  password: '',
};

export function ImportWallet() {
  const { register, handleSubmit } = useForm<Inputs>({ defaultValues });
  const [error, setError] = useState('');
  const { createProfile, isUnlocked, createFirstAccount } = useWallet();
  const { createHDWallet } = useHDWallet();
  async function confirm({ phrase, password, name }: Inputs) {
    const is12Words = phrase.trim().split(' ').length === 12;
    if (!is12Words) {
      setError('enter 12 words');
      return;
    }
    try {
      const { keySourceManager, profile } = await createProfile(name, password);
      // for now we only support slip10 so we just create the keySource and the first account by default for it
      // later we should change this flow to be more flexible
      const keySource = await createHDWallet(
        { keySourceManager },
        'hd-wallet-slip10', // TODO: support chainweaver
        password,
        phrase,
      );
      await createFirstAccount({ keySourceManager, profile }, keySource);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Import mnemonic</Heading>
        <form onSubmit={handleSubmit(confirm)}>
          <Stack flexDirection="column">
            <label htmlFor="phrase">Enter the 12 word recovery phrase</label>
            <TextField id="phrase" type="phrase" {...register('phrase')} />

            <Box>
              <input type="checkbox" id="isChainweaver" />
              <label htmlFor="isChainweaver">Import from Chainweaver</label>
            </Box>

            <Heading variant="h5">Profile</Heading>

            <label htmlFor="name">Profile name</label>
            <TextField id="name" type="text" {...register('name')} />

            <label htmlFor="password">Choose a new password</label>
            <TextField
              id="password"
              type="password"
              {...register('password')}
            />

            <Button type="submit">Confirm</Button>
          </Stack>
        </form>
        {error && <Text variant="base">{error}</Text>}
      </Box>
    </main>
  );
}
