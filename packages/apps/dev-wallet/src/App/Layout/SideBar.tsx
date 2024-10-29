import {
  MonoContacts,
  MonoContrast,
  MonoDataThresholding,
  MonoKey,
  MonoLogout,
  MonoNetworkCheck,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoTerminal,
  MonoTextSnippet,
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
  SideBarAppContext,
  SideBarContext,
  SideBarItem,
  SideBarItemsInline,
  SideBarNavigation,
  SideBar as SideBarUI,
  useSideBar,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { appContext, isExpanded } = useSideBar();
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
    <SideBarUI>
      <SideBarAppContext>
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
        {appContext && <SideBarItem {...appContext} />}
      </SideBarAppContext>
      <SideBarNavigation>
        <SideBarItem
          visual={<MonoDataThresholding />}
          label="Dashboard"
          onPress={() => navigate('/')}
        />

        <SideBarItem
          visual={<MonoSignature />}
          label="Sig Builder"
          onPress={() => navigate('/sig-builder')}
        />

        <SideBarItem
          visual={<MonoSwapHoriz />}
          label="Transfer"
          onPress={() => {
            navigate('/transfer');
          }}
        />

        <SideBarItem
          visual={<MonoTableRows />}
          label="Transactions"
          onPress={() => navigate('/transactions')}
        />

        <SideBarItem
          visual={<MonoContacts />}
          label="Contacts"
          onPress={() => navigate('/contacts')}
        />

        <SideBarItem
          visual={<MonoTextSnippet />}
          label="Backup"
          onPress={() => navigate('/backup-recovery-phrase/write-down')}
        />

        <SideBarItem
          visual={<MonoKey />}
          label="Keys"
          onPress={() => navigate('/key-management/keys')}
        />

        <SideBarItem
          visual={<MonoTerminal />}
          label="Dev Console"
          onPress={() => navigate('/terminal')}
        />
      </SideBarNavigation>

      <SideBarContext>
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
      </SideBarContext>
    </SideBarUI>
  );
};
