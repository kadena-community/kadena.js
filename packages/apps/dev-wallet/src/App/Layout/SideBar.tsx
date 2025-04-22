import {
  MonoCandlestickChart,
  MonoCheck,
  MonoContacts,
  MonoContrast,
  MonoControlPointDuplicate,
  MonoDarkMode,
  MonoExtension,
  MonoKey,
  MonoLightMode,
  MonoLogout,
  MonoNetworkCheck,
  MonoSettings,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoWallet,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';

import { LoadedPlugin, pluginManager } from '@/modules/plugins/PluginManager';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { getWebAuthnPass } from '@/modules/wallet/wallet.service';
import InitialsAvatar from '@/pages/select-profile/initials';
import { getInitials } from '@/utils/get-initials';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Divider,
  Heading,
  Stack,
  Text,
  Themes,
  Link as UILink,
  useTheme,
} from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBarItemsInline,
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
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useSideBarLayout();
  const { lockProfile, profileList, unlockProfile, profile } = useWallet();
  const navigate = usePatchedNavigate();
  const [loadedPlugins, setLoadedPlugins] = useState<LoadedPlugin[]>(
    () => pluginManager.plugins,
  );

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  useEffect(() => {
    const unsubscribe = pluginManager.onStatusChange(() => {
      setLoadedPlugins(pluginManager.plugins);
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
          {profile?.showExperimentalFeatures && (
            <>
              <SideBarItem
                visual={<MonoExtension />}
                label="Plugins"
                component={Link}
                href="/plugins"
              />
              {loadedPlugins.length > 0 && (
                <>
                  <Divider />
                  <Stack marginInlineStart={'md'} flexDirection={'column'}>
                    <Text size="small">Loaded Plugins</Text>
                  </Stack>
                  {loadedPlugins.map((plugin) => (
                    <SideBarItem
                      visual={<MonoCandlestickChart />}
                      label={plugin.config.name}
                      component={Link}
                      href={`/plugins?plugin-id=${plugin.config.id}`}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </>
      }
      context={
        <>
          <SideBarItemsInline>
            <SideBarItem visual={<MonoContacts />} label="Profile">
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
            </SideBarItem>
            <SideBarItem
              visual={<MonoContrast />}
              onPress={toggleTheme}
              label="Change theme"
            >
              <Button
                isCompact
                variant="transparent"
                onPress={() => toggleTheme()}
                startVisual={
                  theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />
                }
              />
            </SideBarItem>
          </SideBarItemsInline>
        </>
      }
    ></SideBarUI>
  );
};
