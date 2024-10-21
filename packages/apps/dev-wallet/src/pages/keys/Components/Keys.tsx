import { ListItem } from '@/Components/ListItem/ListItem.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.tsx';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { WebAuthnService } from '@/modules/key-source/web-authn/webauthn';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers.ts';
import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { panelClass } from '../../home/style.css.ts';
import { AddKeySourceDialog } from './AddKeySourceDialog.tsx';

export function Keys() {
  const { keySources, profile, askForPassword, createKey } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [showAddKeySource, setShowAddKeySource] = useState(false);
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
      <AddKeySourceDialog
        isOpen={showAddKeySource}
        close={() => setShowAddKeySource(false)}
        onSave={async (sourcesToInstall) => {
          setShowAddKeySource(false);
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
          }
          keySourceManager.disconnect();
        }}
        installed={keySources.map((k) => k.source)}
      />
      <Stack flexDirection={'column'} gap={'lg'}>
        <Stack justifyContent={'space-between'} alignItems={'center'}>
          <Stack marginBlock={'md'}>
            <Heading variant="h3">Your Keys</Heading>
          </Stack>
          <Button
            onPress={() => setShowAddKeySource(true)}
            variant="outlined"
            isCompact
          >
            Add key Source
          </Button>
        </Stack>
        {error && (
          <Stack marginBlock={'lg'}>
            <Notification intent="negative" role="alert">
              {error}
            </Notification>
          </Stack>
        )}
        <Stack flexDirection={'column'} gap="md">
          {keySources.map((keySource) => (
            <Stack
              key={keySource.uuid}
              flexDirection={'column'}
              className={panelClass}
            >
              <Stack
                gap={'lg'}
                justifyContent={'space-between'}
                marginBlockEnd={'sm'}
              >
                <Heading variant="h4">Method: {keySource.source}</Heading>
                <Stack flexDirection={'row'} gap={'sm'}>
                  <Button
                    startVisual={<MonoAdd />}
                    variant="outlined"
                    isCompact
                    onPress={() => createKey(keySource)}
                  >
                    Create Next Key
                  </Button>
                  <ContextMenu
                    placement="bottom end"
                    trigger={
                      <Button
                        endVisual={<MonoMoreVert />}
                        variant="transparent"
                        isCompact
                      />
                    }
                  >
                    {['HD-BIP44', 'HD-chainweaver'].includes(
                      keySource.source,
                    ) && (
                      <ContextMenuItem
                        label="Create specific key"
                        onClick={() => {}}
                      />
                    )}
                  </ContextMenu>
                </Stack>
              </Stack>
              {keySource.keys.map((key) => (
                <ListItem>
                  <Stack
                    key={key.index}
                    flexDirection={'row'}
                    flex={1}
                    gap={'lg'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Stack gap={'lg'}>
                      <Text> Index: {key.index}</Text>
                      <Text>{shorten(key.publicKey, 35)}</Text>
                    </Stack>
                    <ContextMenu
                      placement="bottom end"
                      trigger={
                        <Button
                          endVisual={<MonoMoreVert />}
                          variant="transparent"
                          isCompact
                        />
                      }
                    >
                      <ContextMenuItem
                        label="Create KDA account"
                        onClick={() => {}}
                      />
                      <ContextMenuItem label="Disable key" onClick={() => {}} />
                    </ContextMenu>
                  </Stack>
                </ListItem>
              ))}
              {(!keySource.keys || keySource.keys.length === 0) && (
                <Text>No keys created yet</Text>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
