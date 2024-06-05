import { HDWalletKeySource } from '@/modules/key-source/key-source.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { KeySourceType } from '@/modules/wallet/wallet.repository';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmRecoveryPhrase } from './confirm-recovery-phrase';
import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { MonoContentCopy } from '@kadena/react-icons/system';

export function WriteDownRecoveryPhrase() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const { keySources, decryptSecret } = useWallet();
  const { keySourceId } = useParams();
  const [mnemonic, setMnemonic] = useState('');
  const [codeVisible, setCodeVisible] = useState(false);
  const [error, setError] = useState('');
  const [readyForConfirmation, setReadyForConfirmation] = useState(false);
  const navigate = useNavigate();
  const maskedValue = (): string => {
    const maskedSymbol = "*";
    return maskedSymbol.repeat(5);
  }
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
        throw new Error('Mnemonic is not found');
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
      <AuthCard backButtonLink="/backup-recovery-phrase">
        <Heading variant="h5">Write down your phrase</Heading>
        <Text>
          Secure your assets by writing down or exporting your recovery phrase. 
          Otherwise you will lose your assets if this wallet is deleted.
        </Text>
        {/* todo: check if password needed */}
        <form onSubmit={handleSubmit(decryptMnemonic)}>
          <label htmlFor="password">Password</label>
          <TextField id="password" type="password" {...register('password')} />
          <Button type="submit">Show Phrase</Button>
        </form>
        {error && <Text>{error}</Text>}
        {mnemonic && (
          <>
            <Stack
              alignItems="center"
              flexDirection="row"
              gap="md"
              justifyContent="space-between"
            >
              <Heading as="h6">Recovery phrase</Heading>
              <Button
                variant="transparent"
                endVisual={<MonoContentCopy />}
                isCompact
                onPress={() => navigator.clipboard.writeText(mnemonic)}
              >
                Copy
              </Button>
            </Stack>
            <Stack gap="md" flexWrap="wrap">
              {mnemonic.split(' ').map((word, index) => {
                return (
                  <span key={index}>
                    {index + 1} {codeVisible ? word : maskedValue()}
                  </span>
                )
              })}
            </Stack>
          </>
        )}
        <Stack flexDirection="column" gap="md">
          <Button
            variant="outlined"
            onPress={() => setCodeVisible(!codeVisible)}
          >
            {codeVisible ? 'Hide code' : 'Show code'}
          </Button>
          <Button
            variant="primary"
            type="submit"
            onPress={() => setReadyForConfirmation(true)}
          >
            Continue
          </Button>
        </Stack>
      </AuthCard>
    </>
  );
}
