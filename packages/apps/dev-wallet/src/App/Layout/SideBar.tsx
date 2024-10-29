import {
  MonoContacts,
  MonoContrast,
  MonoDashboardCustomize,
  MonoDataThresholding,
  MonoLogout,
  MonoNetworkCheck,
  MonoSwapHoriz,
  MonoTableRows,
  MonoWallet,
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
  useSideBar,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useSideBar();
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
        <SideBarItem
          visual={<MonoNetworkCheck />}
          label="Select network"
          onPress={() => {}}
        >
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
            visual={<MonoDataThresholding />}
            label="Dashboard"
            onPress={() => navigate('/')}
          />

          <SideBarTree visual={<MonoWallet />} label="My Wallets">
            <SideBarTreeItem
              label="Keys"
              onPress={() => navigate('/key-management/keys')}
            />
          </SideBarTree>
          <SideBarTree visual={<MonoTableRows />} label="Transactions">
            <SideBarTreeItem
              label="History"
              onPress={() => navigate('/transactions')}
            />
          </SideBarTree>
          <SideBarTree visual={<MonoDashboardCustomize />} label="Utilities">
            <SideBarTreeItem
              label="Sig Builder"
              onPress={() => navigate('/sig-builder')}
            />
            <SideBarTreeItem
              label="Dev Console"
              onPress={() => navigate('/terminal')}
            />
            <SideBarTreeItem
              label="Backup"
              onPress={() => navigate('/backup-recovery-phrase/write-down')}
            />
          </SideBarTree>

          <SideBarItem
            visual={<MonoSwapHoriz />}
            label="Transfer"
            onPress={() => {
              navigate('/transfer');
            }}
          />

          <SideBarItem
            visual={<MonoContacts />}
            label="Contacts"
            onPress={() => navigate('/contacts')}
          />
        </>
      }
      context={
        <>
          <SideBarItemsInline>
            <SideBarItem
              visual={<MonoContacts />}
              label="Profile"
              onPress={() => {}}
            >
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
