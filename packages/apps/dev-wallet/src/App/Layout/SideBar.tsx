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
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';

import { ProfileChanger } from '@/Components/ProfileChanger/ProfileChanger';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Button, Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBarItemsInline,
  SideBar as SideBarUI,
  useLayout,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { KLogo } from './KLogo';

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useLayout();
  const { lockProfile } = useWallet();

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
          <ProfileChanger />
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
          <SideBarItemsInline>
            <SideBarItem visual={<MonoLogout />} label="Logout">
              <Button
                isCompact
                variant="transparent"
                onPress={lockProfile}
                startVisual={<MonoLogout />}
              />
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
