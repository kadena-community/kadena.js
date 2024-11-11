import {
  MonoApps,
  MonoBackupTable,
  MonoContacts,
  MonoContrast,
  MonoDarkMode,
  MonoKey,
  MonoLightMode,
  MonoLogout,
  MonoNetworkCheck,
  MonoSettings,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoWarning,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';

import { useWallet } from '@/modules/wallet/wallet.hook';
import { getInitials } from '@/utils/get-initials';
import { unlockWithWebAuthn } from '@/utils/unlockWithWebAuthn';
import {
  Avatar,
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
  Themes,
  useTheme,
} from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBarItemsInline,
  SideBar as SideBarUI,
  useLayout,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BetaHeader } from '../BetaHeader';
import { KLogo } from './KLogo';

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useLayout();
  const { lockProfile, profileList, unlockProfile, profile } = useWallet();
  const navigate = useNavigate();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  return (
    <SideBarUI
      logo={
        <>
          <Link to="/">
            <KLogo height={40} />
          </Link>
        </>
      }
      appContext={
        <SideBarItem visual={<MonoNetworkCheck />} label="Select network">
          <NetworkSelector
            showLabel={isExpanded}
            variant="outlined"
            isCompact
          />
        </SideBarItem>
      }
      navigation={
        <>
          <SideBarItem
            visual={<MonoApps />}
            label="Dashboard"
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
            visual={<MonoSignature />}
            label="Sig Builder"
            component={Link}
            href="/sig-builder"
          />

          <SideBarItem
            visual={<MonoTableRows />}
            label="Transactions"
            component={Link}
            href="/transactions"
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

          <SideBarItem
            visual={<MonoBackupTable />}
            label="Backup"
            component={Link}
            href="/backup-recovery-phrase/write-down"
          />
        </>
      }
      context={
        <>
          <>
            {isExpanded ? (
              <BetaHeader />
            ) : (
              <Stack
                backgroundColor="semantic.warning.default"
                justifyContent={'center'}
                alignItems={'center'}
                padding={'sm'}
              >
                <Text>
                  <MonoWarning />
                </Text>
              </Stack>
            )}
          </>

          <SideBarItemsInline>
            <SideBarItem visual={<MonoContacts />} label="Profile">
              <ContextMenu
                trigger={
                  <Button
                    isCompact
                    variant={isExpanded ? 'outlined' : 'transparent'}
                    startVisual={
                      <Avatar
                        name={getInitials(profile!.name)}
                        color={'category1'}
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
                {profileList.map((profile, index) => (
                  <ContextMenuItem
                    key={profile.uuid}
                    label={
                      (
                        <Stack gap="sm">
                          <Avatar
                            color={('category' + ((index + 1) % 8)) as any}
                            name={getInitials(profile.name)}
                          />
                          <Text>{profile.name}</Text>
                        </Stack>
                      ) as any
                    }
                    onClick={async () => {
                      if (profile.options.authMode === 'WEB_AUTHN') {
                        await unlockWithWebAuthn(profile, unlockProfile);
                      } else {
                        navigate(`/unlock-profile/${profile.uuid}`);
                      }
                    }}
                  />
                ))}
                <ContextMenuDivider />
                <ContextMenuItem
                  endVisual={<MonoSettings />}
                  label="Settings"
                  isDisabled
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
