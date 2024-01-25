import { useWallet } from '@/hooks/wallet.context';
import { Box, Button, Heading, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ConfirmRecoveryPhrase } from './confirm-recovery-phrase';

export function WriteDownRecoveryPhrase() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const wallet = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [readyForConfirmation, setReadyForConfirmation] = useState(false);
  const navigate = useNavigate();
  async function decryptMnemonic({ password }: { password: string }) {
    setError('');
    try {
      const mnemonic = await wallet.decryptMnemonic(password);
      setMnemonic(mnemonic);
    } catch (e) {
      setError("Password doesn't match");
    }
  }
  if (readyForConfirmation) {
    return (
      <ConfirmRecoveryPhrase
        mnemonic={mnemonic}
        onConfirm={() => {
          // TODO: check if there is a way to wipe the mnemonic from memory
          navigate('/');
        }}
      />
    );
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Write your recovery phrase down</Heading>
        <Text>
          Make sure no one is watching you; consider some malware might take
          screenshot of your screen
        </Text>
        <Text>
          you should consider everyone with the phrase have access to your
          assets
        </Text>
        <Heading variant="h5">Enter your password to show the phrase</Heading>
        <form onSubmit={handleSubmit(decryptMnemonic)}>
          <label htmlFor="password">Password</label>
          <TextField id="password" type="password" {...register('password')} />
          <Button type="submit">Show Phrase</Button>
        </form>
        {error && <Text variant="base">{error}</Text>}
        <Text variant="small">{mnemonic}</Text>
        <Button
          type="submit"
          onClick={() => {
            setReadyForConfirmation(true);
          }}
        >
          Confirm
        </Button>
      </Box>
    </main>
  );
}
