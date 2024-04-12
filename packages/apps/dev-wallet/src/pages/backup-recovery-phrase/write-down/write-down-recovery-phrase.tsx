import { HDWalletKeySource } from '@/modules/key-source/key-source.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { KeySourceType } from '@/modules/wallet/wallet.repository';
import { Box, Button, Heading, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmRecoveryPhrase } from './confirm-recovery-phrase';

export function WriteDownRecoveryPhrase() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const { keySources, decryptSecret } = useWallet();
  const { keySourceId } = useParams();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [readyForConfirmation, setReadyForConfirmation] = useState(false);
  const navigate = useNavigate();
  async function decryptMnemonic({ password }: { password: string }) {
    setError('');
    try {
      // TODO: this should check the source type of the keySource
      const keySource = keySources.find((ks) => ks.uuid === keySourceId);
      if (!keySource) {
        throw new Error('Key source not found');
      }
      if (
        !(['HD-BIP44', 'HD-chainweaver'] as KeySourceType[]).includes(
          keySource.source,
        )
      ) {
        throw new Error('Unsupported key source');
      }
      const secretId = (keySource as HDWalletKeySource).secretId;
      if (!secretId) {
        throw new Error('No mnemonic found');
      }
      const mnemonic = await decryptSecret(password, secretId);
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
        {error && <Text>{error}</Text>}
        <Text size="small">{mnemonic}</Text>
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
