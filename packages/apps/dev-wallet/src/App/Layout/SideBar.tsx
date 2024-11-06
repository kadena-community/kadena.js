import {
  MonoContacts,
  MonoContrast,
  MonoDashboardCustomize,
  MonoLogout,
  MonoNetworkCheck,
  MonoTableRows,
  MonoWallet,
  MonoWindow,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Themes,
  useTheme,
} from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBarItemsInline,
  SideBarTree,
  SideBarTreeItem,
  SideBar as SideBarUI,
  useLayout,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
          <NetworkSelector
            showLabel={isExpanded}
            variant="outlined"
            isCompact={!isExpanded}
          />
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

          <SideBarTree visual={<MonoWallet />} label="My Wallets">
            <SideBarTreeItem
              label="Keys"
              component={Link}
              href="/key-management/keys"
            />
          </SideBarTree>
          <SideBarTree visual={<MonoTableRows />} label="Transactions">
            <SideBarTreeItem
              label="History"
              component={Link}
              href="/transactions"
            />
          </SideBarTree>
          <SideBarTree visual={<MonoDashboardCustomize />} label="Utilities">
            <SideBarTreeItem
              label="Sig Builder"
              component={Link}
              href="/sig-builder"
            />
            <SideBarTreeItem
              label="Dev Console"
              component={Link}
              href="/terminal"
            />
            <SideBarTreeItem
              label="Backup"
              component={Link}
              href="/backup-recovery-phrase/write-down"
            />
          </SideBarTree>

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
