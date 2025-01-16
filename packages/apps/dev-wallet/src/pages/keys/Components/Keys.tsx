import { ListItem } from '@/Components/ListItem/ListItem.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.tsx';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { keySourceRepository } from '@/modules/key-source/key-source.repository.ts';
import { WebAuthnService } from '@/modules/key-source/web-authn/webauthn';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers.ts';
import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { panelClass } from '../../home/style.css.ts';
import { AddKeySourceForm } from './AddKeySourceForm.tsx';
import { AddSpecificKey } from './AddSpecificKey.tsx';

export function Keys() {
  const { keySources, profile, askForPassword, createKey } = useWallet();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [asideTarget, setAsideTarget] = useState<
    'add-key-source' | 'add-specific-key'
  >();
  const showKeySourceForm = () => {
    setAsideTarget('add-key-source');
    setIsRightAsideExpanded(true);
  };
  const showAddSpecificKeyForm = () => {
    setAsideTarget('add-specific-key');
    setIsRightAsideExpanded(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);
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

  const defaultIndex = keySources.findIndex((ks) => ks.isDefault) || 0;

  return (
    <>
      <AddKeySourceForm
        isOpen={isRightAsideExpanded && asideTarget === 'add-key-source'}
        close={() => setIsRightAsideExpanded(false)}
        onSave={async (sourcesToInstall) => {
          setIsRightAsideExpanded(false);
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
            variant="outlined"
            isCompact
            onPress={() => {
              showKeySourceForm();
            }}
          >
            Add key Source
          </Button>
        </Stack>

        <Stack flexDirection={'column'} gap="md">
          {keySources.map((keySource, index) => (
            <Stack
              key={keySource.uuid}
              flexDirection={'column'}
              className={panelClass}
            >
              <AddSpecificKey
                keySource={keySource}
                isOpen={
                  isRightAsideExpanded && asideTarget === 'add-specific-key'
                }
              />
              <Stack
                gap={'lg'}
                justifyContent={'space-between'}
                marginBlockEnd={'sm'}
              >
                <Heading variant="h4">
                  Method: {keySource.source}{' '}
                  {defaultIndex === index && <Text>(Default method)</Text>}
                </Heading>

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
                    ) ? (
                      <ContextMenuItem
                        label="Create specific key"
                        onClick={() => {
                          showAddSpecificKeyForm();
                        }}
                      />
                    ) : (
                      <ContextMenuDivider />
                    )}
                    <ContextMenuItem
                      label="Set as default method"
                      onClick={async () => {
                        await keySourceRepository.setAsDefault(
                          keySource.uuid,
                          profile!.uuid,
                        );
                      }}
                    />
                  </ContextMenu>
                </Stack>
              </Stack>
              {keySource.keys.map((key) => (
                <ListItem key={key.index}>
                  <Stack
                    key={key.index}
                    flexDirection={'row'}
                    flex={1}
                    gap={'lg'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Stack gap={'md'}>
                      <Text> Idx: {key.index}</Text>
                      <Text>{shorten(key.publicKey, 20)}</Text>
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
                        label="Copy"
                        onClick={() => {
                          navigator.clipboard.writeText(key.publicKey);
                        }}
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
