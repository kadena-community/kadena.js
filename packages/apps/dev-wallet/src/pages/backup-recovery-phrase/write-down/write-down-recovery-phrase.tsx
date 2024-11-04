import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { BackupMnemonic } from '@/Components/BackupMnemonic/BackupMnemonic';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoDashboardCustomize } from '@kadena/kode-icons/system';
import { Notification } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function WriteDownRecoveryPhrase() {
  const { initPage } = useLayout();
  const { decryptSecret, askForPassword, profile } = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useMemo(() => {
    initPage({
      appContext: undefined,
      breadCrumbs: [
        {
          label: 'Backup',
          visual: <MonoDashboardCustomize />,
          url: '/backup-recovery-phrase',
        },
        {
          label: 'Recovery phrase',
          url: '/backup-recovery-phrase/write-down',
        },
      ],
    });
  }, []);

  async function decryptMnemonic() {
    setError('');
    try {
      const secretId = profile?.securityPhraseId;
      if (!secretId) {
        throw new Error('No mnemonic found');
      }
      const password = await askForPassword(true);
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
