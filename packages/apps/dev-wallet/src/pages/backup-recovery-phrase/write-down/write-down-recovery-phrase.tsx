import {
  IHDBIP44,
  IHDChainweaver,
} from '@/modules/key-source/key-source.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Button, Heading, Text } from '@kadena/kode-ui';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmRecoveryPhrase } from './confirm-recovery-phrase';

export function WriteDownRecoveryPhrase() {
  const { keySources, decryptSecret, askForPassword } = useWallet();
  const { keySourceId } = useParams();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [readyForConfirmation, setReadyForConfirmation] = useState(false);
  const navigate = useNavigate();
  async function decryptMnemonic() {
    setError('');
    try {
      // TODO: this should check the source type of the keySource
      const keySource = keySources.find((ks) => ks.uuid === keySourceId);
      if (!keySource) {
        throw new Error('Key source not found');
      }
      if (
        keySource.source !== 'HD-BIP44' &&
        keySource.source !== 'HD-chainweaver'
      ) {
        throw new Error('Unsupported key source');
      }
      const secretId = (keySource as IHDBIP44 | IHDChainweaver).secretId;
      if (!secretId) {
        throw new Error('No mnemonic found');
      }
      const password = await askForPassword();
      if (!password) {
        throw new Error('Password not found');
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
    <>
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
        <Button type="submit" onClick={decryptMnemonic}>
          Show Phrase
        </Button>
        {error && <Text>{error}</Text>}
        <Text size="small">{mnemonic}</Text>
        <Button
          type="submit"
          onPress={() => {
            setReadyForConfirmation(true);
          }}
        >
          Confirm
        </Button>
      </Box>
    </>
  );
}
