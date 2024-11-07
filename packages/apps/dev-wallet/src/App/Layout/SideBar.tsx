import {
  MonoBackupTable,
  MonoContacts,
  MonoContrast,
  MonoKey,
  MonoLogout,
  MonoNetworkCheck,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoWindow,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Stack,
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

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useLayout();
  const navigate = useNavigate();
  const { lockProfile } = useWallet();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  const handleLogout = () => {
    lockProfile();
  };
  return (
    <SideBarUI
      appContext={
        <SideBarItem visual={<MonoNetworkCheck />} label="Select network">
          <Stack marginBlockEnd={'xl'} flex={1}>
            <NetworkSelector
              showLabel={isExpanded}
              variant="outlined"
              isCompact={!isExpanded}
            />
          </Stack>
        </SideBarItem>
      }
      navigation={
        <>
          <SideBarItem
            visual={<MonoWindow />}
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
          <BetaHeader />
          <SideBarItemsInline>
            <SideBarItem visual={<MonoContacts />} label="Profile">
              <ContextMenu
                trigger={
                  <Button
                    isCompact={!isExpanded}
                    variant="outlined"
                    endVisual={<MonoContacts />}
                  >
                    {isExpanded ? 'Profile' : undefined}
                  </Button>
                }
              >
                <ContextMenuItem
                  onClick={() => navigate('/profile')}
                  label="Profile"
                />
                <ContextMenuItem
                  endVisual={<MonoLogout />}
                  label="Logout"
                  onClick={handleLogout}
                />
              </ContextMenu>
            </SideBarItem>
            <SideBarItem
              visual={<MonoContrast />}
              onPress={toggleTheme}
              label="Change theme"
            >
              <Button
                variant={isExpanded ? 'transparent' : 'outlined'}
                onPress={() => toggleTheme()}
                startVisual={<MonoContrast />}
                isCompact={!isExpanded}
              />
            </SideBarItem>
          </SideBarItemsInline>
        </>
      }
    ></SideBarUI>
  );
};
