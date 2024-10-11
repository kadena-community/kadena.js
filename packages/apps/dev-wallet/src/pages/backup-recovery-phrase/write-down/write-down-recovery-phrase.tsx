import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { BackupMnemonic } from '@/Components/BackupMnemonic/BackupMnemonic';
import {
  IHDBIP44,
  IHDChainweaver,
} from '@/modules/key-source/key-source.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Notification } from '@kadena/kode-ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function WriteDownRecoveryPhrase() {
  const { keySources, decryptSecret, askForPassword } = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function decryptMnemonic() {
    setError('');
    try {
      // TODO: this should check the source type of the keySource
      const keySource = keySources[0];
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
  if (error) {
    return (
      <AuthCard>
        <Notification intent="negative" role="alert">
          {error}
        </Notification>
      </AuthCard>
    );
  }
  return (
    <>
      {
        <AuthCard>
          <BackupMnemonic
            mnemonic={mnemonic}
            onDecrypt={decryptMnemonic}
            onSkip={() => navigate('/')}
            onConfirm={() => navigate('/')}
          />
        </AuthCard>
      }
    </>
  );
}
