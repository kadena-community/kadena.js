import {
  MonoCheck,
  MonoContacts,
  MonoControlPointDuplicate,
  MonoExtension,
  MonoKey,
  MonoLogout,
  MonoMoreVert,
  MonoNetworkCheck,
  MonoSettings,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoWallet,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { LoadedPlugin, pluginManager } from '@/modules/plugins/PluginManager';
import { Plugin } from '@/modules/plugins/type';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { getWebAuthnPass } from '@/modules/wallet/wallet.service';
import InitialsAvatar from '@/pages/select-profile/initials';
import { getInitials } from '@/utils/get-initials';
import {
  Badge,
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
  ThemeAnimateIcon,
  Link as UILink,
  useTheme,
} from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBar as SideBarUI,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatchedNavigate } from '../../utils/usePatchedNavigate';
import { KLogo } from './KLogo';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  const { theme, rotateTheme } = useTheme();
  const { isExpanded } = useSideBarLayout();
  const { lockProfile, profileList, unlockProfile, profile } = useWallet();
  const navigate = usePatchedNavigate();
  const [loadedPlugins, setLoadedPlugins] = useState<LoadedPlugin[]>(
    () => pluginManager.loadedPluginsList,
  );
  const [plugins, setPlugins] = useState<Plugin[]>(
    () => pluginManager.pluginsList,
  );

  pluginManager.availablePlugins;
  useEffect(() => {
    const unsubscribe = pluginManager.onStatusChange(() => {
      setLoadedPlugins(pluginManager.loadedPluginsList);
      setPlugins(pluginManager.pluginsList);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SideBarUI
      topbannerHeight={topbannerHeight}
      logo={
        <>
          <Link to="/">
            <KLogo />
          </Link>
        </>
      }
      appContext={
        <>
          <SideBarItem visual={<MonoNetworkCheck />} label="Select network">
            <NetworkSelector
              showLabel={isExpanded}
              variant="outlined"
              isCompact
            />
          </SideBarItem>
          <SideBarItem component={Link} visual={<></>} label="">
            <UILink
              isCompact
              href="/transfer"
              component={Link}
              variant="outlined"
              startVisual={<MonoControlPointDuplicate />}
            >
              {isExpanded ? 'New Transfer' : <></>}
            </UILink>
          </SideBarItem>
        </>
      }
      navigation={
        <>
          <SideBarItem
            visual={<MonoWallet />}
            label="Your Assets"
            component={Link}
            href="/"
          />

          <SideBarItem
            visual={<MonoSwapHoriz />}
            label="Transfer"
            component={Link}
            href="/transfer"
          />

          <SideBarItem
            visual={<MonoTableRows />}
            label="Activities"
            component={Link}
            href="/activities"
          />

          <SideBarItem
            visual={<MonoSignature />}
            label="Sig Builder"
            component={Link}
            href="/sig-builder"
          />

          <SideBarItem
            label="Key Management"
            component={Link}
            href="/key-management/keys"
            visual={<MonoKey />}
          />

          <SideBarItem
            visual={<MonoContacts />}
            label="Contacts"
            component={Link}
            href="/contacts"
          />
        </>
      }
      context={
        <>
          {profile?.showExperimentalFeatures && (
            <Stack data-isexpanded={isExpanded}>
              <SideBarItem visual={<MonoExtension />} label="plugins">
                <ButtonGroup fullWidth>
                  <Button
                    startVisual={<MonoExtension />}
                    variant={isExpanded ? 'outlined' : 'transparent'}
                    isCompact
                    onPress={() => {
                      navigate('/plugins');
                    }}
                  >
                    {isExpanded ? 'Plugins' : ''}
                  </Button>

                  <ContextMenu
                    trigger={
                      <Button
                        isCompact
                        variant={isExpanded ? 'outlined' : 'transparent'}
                        startVisual={<MonoMoreVert />}
                      />
                    }
                  >
                    {plugins.map((plugin) => (
                      <ContextMenuItem
                        key={plugin.id}
                        onClick={() => {
                          navigate(`/plugins?plugin-id=${plugin.id}`);
                        }}
                        label={plugin.name}
                        endVisual={
                          <>
                            {loadedPlugins.find(
                              (p) => p.config.name === plugin.name,
                            ) ? (
                              <Badge size="sm" style="positive">
                                {''}
                              </Badge>
                            ) : null}
                          </>
                        }
                      />
                    ))}
                  </ContextMenu>
                </ButtonGroup>
              </SideBarItem>
            </Stack>
          )}
          <SideBarItem visual={<MonoContacts />} label="Profile">
            <Stack data-isexpanded={isExpanded}>
              <ButtonGroup fullWidth>
                <ContextMenu
                  trigger={
                    <Button
                      isCompact
                      variant={isExpanded ? 'outlined' : 'transparent'}
                      startVisual={
                        <InitialsAvatar
                          name={getInitials(profile!.name)}
                          accentColor={profile!.accentColor}
                          size="small"
                        />
                      }
                    >
                      {isExpanded ? profile?.name : undefined}
                    </Button>
                  }
                >
                  <Stack
                    paddingInline={'md'}
                    paddingBlockStart={'md'}
                    paddingBlockEnd={'sm'}
                  >
                    <Heading variant="h6">Switch Profile</Heading>
                  </Stack>
                  {profileList.map((prf) => (
                    <ContextMenuItem
                      key={prf.uuid}
                      endVisual={
                        prf.uuid === profile?.uuid ? (
                          <Text>
                            <MonoCheck />
                          </Text>
                        ) : undefined
                      }
                      label={
                        (
                          <Stack gap="sm">
                            <InitialsAvatar
                              name={getInitials(prf!.name)}
                              accentColor={prf!.accentColor}
                              size="small"
                            />
                            <Text>{prf.name}</Text>
                          </Stack>
                        ) as any
                      }
                      onClick={async () => {
                        if (prf.uuid === profile?.uuid) return;
                        if (prf.options.authMode === 'WEB_AUTHN') {
                          const pass = await getWebAuthnPass(prf);
                          if (pass) {
                            lockProfile();
                            await unlockProfile(prf.uuid, pass);
                          }
                        } else {
                          navigate(`/unlock-profile/${prf.uuid}`);
                        }
                      }}
                    />
                  ))}
                  <ContextMenuDivider />
                  <ContextMenuItem
                    endVisual={<MonoSettings />}
                    label="Settings"
                    onClick={() => navigate('/settings')}
                  />
                  <ContextMenuItem
                    endVisual={<MonoLogout />}
                    label="Logout"
                    onClick={lockProfile}
                  />
                </ContextMenu>
                <Button
                  isCompact
                  variant={isExpanded ? 'outlined' : 'transparent'}
                  onPress={rotateTheme}
                  startVisual={<ThemeAnimateIcon theme={theme} />}
                />
              </ButtonGroup>
            </Stack>
          </SideBarItem>
        </>
      }
    ></SideBarUI>
  );
};
