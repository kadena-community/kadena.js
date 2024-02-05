import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Box, Button, Heading, Text, TextField } from '@kadena/react-ui';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function CreateProfile() {
  const { register, handleSubmit } = useForm<{
    password: string;
    profileName: string;
  }>();
  const { createProfile, isUnlocked, createFirstAccount } = useWallet();
  const { createHDWallet } = useHDWallet();
  async function create({
    profileName,
    password,
  }: {
    profileName: string;
    password: string;
  }) {
    const mnemonic = kadenaGenMnemonic();
    const { keySourceManager, profile } = await createProfile(
      profileName,
      password,
    );
    // for now we only support slip10 so we just create the keySource and the first account by default for it
    // later we should change this flow to be more flexible
    const keySource = await createHDWallet(
      { keySourceManager },
      'hd-wallet-slip10',
      password,
      mnemonic,
    );
    await createFirstAccount({ keySourceManager, profile }, keySource);
    console.log('wallet created');
    debugger;
  }
  if (isUnlocked) {
    return <Navigate to="/backup-recovery-phrase" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Create wallet</Heading>
        <Text>Enter a password to encrypt the wallet data with that</Text>
        <form onSubmit={handleSubmit(create)}>
          <label htmlFor="profileName">Profile name</label>
          <TextField
            id="profileName"
            type="text"
            {...register('profileName')}
          />
          <label htmlFor="password">Password</label>
          <TextField id="password" type="password" {...register('password')} />
          <Button type="submit">Create</Button>
        </form>
      </Box>
    </main>
  );
}
