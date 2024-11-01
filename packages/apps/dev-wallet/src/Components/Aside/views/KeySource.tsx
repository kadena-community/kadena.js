import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { WebAuthnService } from '@/modules/key-source/web-authn/webauthn';
import { useWallet } from '@/modules/wallet/wallet.hook';

import { AddKeySourceForm } from '@/pages/keys/Components/AddKeySourceForm';
import { Notification, Stack } from '@kadena/kode-ui';
import { useSideBar } from '@kadena/kode-ui/patterns';
import { FC, useState } from 'react';

const KeySource: FC = () => {
  const { handleSetAsideExpanded } = useSideBar();
  const { keySources, profile, askForPassword } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const { createHDWallet } = useHDWallet();

  async function createWebAuthn() {
    if (!profile) {
      throw new Error('No profile found');
    }
    if (keySources.find((keySource) => keySource.source === 'web-authn')) {
      // basically its possible to have multiple web-authn sources
      // but for now just for simplicity we will only allow one
      alert('WebAuthn already created');
      throw new Error('WebAuthn already created');
    }
    const service = (await keySourceManager.get(
      'web-authn',
    )) as WebAuthnService;

    await service.register(profile.uuid);
  }

  const registerHDWallet =
    (type: 'HD-BIP44' | 'HD-chainweaver') => async () => {
      const password = await askForPassword();
      if (!password || !profile) {
        return;
      }
      await createHDWallet(profile?.uuid, type, password);
    };

  return (
    <>
      {error && (
        <Stack marginBlock={'lg'}>
          <Notification intent="negative" role="alert">
            {error}
          </Notification>
        </Stack>
      )}

      <AddKeySourceForm
        onClose={() => handleSetAsideExpanded(false)}
        onSave={async (sourcesToInstall) => {
          try {
            await Promise.all(
              sourcesToInstall.map(async (source) => {
                switch (source) {
                  case 'HD-BIP44':
                    await registerHDWallet('HD-BIP44')();
                    break;
                  case 'HD-chainweaver':
                    await registerHDWallet('HD-chainweaver')();
                    break;
                  case 'web-authn':
                    await createWebAuthn();
                    break;
                  default:
                    throw new Error('Unsupported key source');
                }
              }),
            );
          } catch (error: any) {
            setError(error?.message ?? JSON.stringify(error));
          } finally {
            handleSetAsideExpanded(false);
          }
          keySourceManager.disconnect();
        }}
        installed={keySources.map((k) => k.source)}
      />
    </>
  );
};

export default KeySource;
