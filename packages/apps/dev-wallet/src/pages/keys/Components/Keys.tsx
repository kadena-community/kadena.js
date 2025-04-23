import { ListItem } from '@/Components/ListItem/ListItem.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.tsx';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { keySourceRepository } from '@/modules/key-source/key-source.repository.ts';
import { WebAuthnService } from '@/modules/key-source/web-authn/webauthn';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { KeySourceType } from '@/modules/wallet/wallet.repository.ts';
import { shorten } from '@/utils/helpers.ts';
import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons/system';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Stack,
  Text,
} from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { Fragment, useState } from 'react';
import { AddKeySourceForm } from './AddKeySourceForm.tsx';
import { AddSpecificKey } from './AddSpecificKey.tsx';

export function Keys() {
  const { keySources, profile, askForPassword, createKey } = useWallet();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const [asideTarget, setAsideTarget] = useState<
    'add-key-source' | KeySourceType | undefined
  >();
  const showKeySourceForm = () => {
    setAsideTarget('add-key-source');
    setIsRightAsideExpanded(true);
  };
  const showAddSpecificKeyForm = (key: KeySourceType) => {
    setAsideTarget(key);
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

  const idx = keySources.findIndex((ks) => ks.isDefault);
  const defaultIndex = idx === -1 ? 0 : idx;

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
            <Fragment key={keySource.source}>
              <AddSpecificKey
                keySource={keySource}
                isOpen={
                  isRightAsideExpanded && asideTarget === keySource.source
                }
              />

              <SectionCard stack="vertical" variant="main">
                <SectionCardContentBlock>
                  <SectionCardHeader
                    title={`Method: ${keySource.source}  ${defaultIndex === index ? '(Default method)' : ''}`}
                    actions={
                      <>
                        <ButtonGroup>
                          <Button
                            startVisual={<MonoAdd />}
                            variant="outlined"
                            isCompact
                            onPress={() => createKey(keySource)}
                          >
                            Create Key
                          </Button>
                          <ContextMenu
                            placement="bottom end"
                            trigger={
                              <Button
                                endVisual={<MonoMoreVert />}
                                variant="outlined"
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
                                  showAddSpecificKeyForm(keySource.source);
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
                        </ButtonGroup>
                      </>
                    }
                  />
                  <SectionCardBody>
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
                            <ContextMenuItem
                              label="Disable key"
                              onClick={() => {}}
                            />
                          </ContextMenu>
                        </Stack>
                      </ListItem>
                    ))}
                    {(!keySource.keys || keySource.keys.length === 0) && (
                      <Text>No keys created yet</Text>
                    )}
                  </SectionCardBody>
                </SectionCardContentBlock>
              </SectionCard>
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
