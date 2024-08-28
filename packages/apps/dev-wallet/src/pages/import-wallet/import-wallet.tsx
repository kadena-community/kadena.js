import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Button, Heading, Stack, Text, TextField } from '@kadena/kode-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  phrase: string;
  name: string;
  password: string;
  fromChainweaver: boolean;
};

const defaultValues: Inputs = {
  phrase: '',
  name: '',
  password: '',
  fromChainweaver: false,
};

export function ImportWallet({
  setOrigin,
}: {
  setOrigin: (pathname: string) => void;
}) {
  const { register, handleSubmit } = useForm<Inputs>({ defaultValues });
  const { createHDWallet } = useHDWallet();
  const [error, setError] = useState('');
  const { createProfile, unlockProfile } = useWallet();
  async function confirm({ phrase, password, name, fromChainweaver }: Inputs) {
    const is12Words = phrase.trim().split(' ').length === 12;
    if (!is12Words) {
      setError('enter 12 words');
      return;
    }
    try {
      const profile = await createProfile(name, password, undefined, {
        authMode: 'PASSWORD',
      });
      const keySource = await createHDWallet(
        profile.uuid,
        fromChainweaver ? 'HD-chainweaver' : 'HD-BIP44',
        password,
        phrase,
      );
      setOrigin(`/account-discovery/${keySource.uuid}`);
      await unlockProfile(profile.uuid, password);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <Box margin="md">
        <Heading variant="h5">Import mnemonic</Heading>
        <form onSubmit={handleSubmit(confirm)}>
          <Stack flexDirection="column">
            <label htmlFor="phrase">Enter the 12 word recovery phrase</label>
            <TextField id="phrase" type="phrase" {...register('phrase')} />

            <Box>
              <input
                type="checkbox"
                id="isChainweaver"
                {...register('fromChainweaver')}
              />
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
        {error && <Text>{error}</Text>}
      </Box>
    </>
  );
}
