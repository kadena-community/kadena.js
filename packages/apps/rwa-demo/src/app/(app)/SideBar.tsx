import { AssetSwitch } from '@/components/AssetSwitch/AssetSwitch';
import { useAccount } from '@/hooks/account';
import {
  MonoAccountBox,
  MonoApps,
  MonoDarkMode,
  MonoLightMode,
  MonoLogout,
  MonoNetworkCheck,
  MonoVpnLock,
} from '@kadena/kode-icons';
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
  SideBar as SideBarLayout,
  useLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { KLogo } from './KLogo';

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useLayout();
  const { logout, account, isMounted } = useAccount();
  const router = useRouter();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    if (!isMounted) return;
    if (!account) {
      router.push('/login');
    }
  }, [isMounted]);

  return (
    <SideBarLayout
      logo={
        <>
          <Link href="/">
            <KLogo height={40} />
          </Link>
        </>
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
            visual={<MonoVpnLock />}
            label="Assets"
            component={Link}
            href="/assets"
          />
        </>
      }
      appContext={
        <SideBarItem visual={<MonoNetworkCheck />} label="Select Asset">
          <AssetSwitch showLabel={isExpanded} />
        </SideBarItem>
      }
      context={
        <>
          <SideBarItemsInline>
            <SideBarItem
              label=""
              visual={<MonoAccountBox />}
              onPress={handleLogout}
            >
              <ContextMenu
                trigger={
                  <Button variant="outlined">
                    {isExpanded ? account?.alias : <MonoAccountBox />}
                  </Button>
                }
              >
                <ContextMenuItem
                  endVisual={<MonoLogout />}
                  label="Logout"
                  onClick={handleLogout}
                />
              </ContextMenu>
            </SideBarItem>
            <SideBarItem
              visual={theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />}
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
    ></SideBarLayout>
  );
};
