import { BackupMnemonic } from '@/Components/BackupMnemonic/BackupMnemonic';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { MonoSettings } from '@kadena/kode-icons/system';
import { Notification } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export function RevealPhrase() {
  const { decryptSecret, askForPassword, profile } = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const navigate = usePatchedNavigate();

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

  if (profile?.securityPhraseId === undefined) {
    return (
      <Notification intent="negative" role="alert">
        No recovery phrase found
      </Notification>
    );
  }

  if (error) {
    return (
      <Notification intent="negative" role="alert">
        {error}
      </Notification>
    );
  }
  return (
    <>
      <SideBarBreadcrumbs icon={<MonoSettings />}>
        <SideBarBreadcrumbsItem href="/settings">
          Settings
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/settings/reveal-phrase">
          Reveal Recovery Phrase
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      {
        <BackupMnemonic
          mnemonic={mnemonic}
          onDecrypt={decryptMnemonic}
          onSkip={() => navigate('/settings')}
          onConfirm={() => navigate('/settings')}
        />
      }
    </>
  );
}
