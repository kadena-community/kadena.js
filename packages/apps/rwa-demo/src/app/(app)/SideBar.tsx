import { AssetSwitch } from '@/components/AssetSwitch/AssetSwitch';
import { useAccount } from '@/hooks/account';
import {
  MonoAccountBox,
  MonoApps,
  MonoAttachMoney,
  MonoDarkMode,
  MonoLightMode,
  MonoLogout,
  MonoNetworkCheck,
  MonoSupportAgent,
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
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { KLogo } from './KLogo';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useSideBarLayout();
  const { logout, account, isMounted, isAgent, isOwner, isComplianceOwner } =
    useAccount();
  const router = useRouter();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  const handleLogout = async () => {
    await logout();
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
      topbannerHeight={topbannerHeight}
      logo={
        <>
          <Link href="/">
            <KLogo />
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

          {(isOwner || isAgent) && (
            <SideBarItem
              visual={<MonoSupportAgent />}
              label="Agents"
              component={Link}
              href="/agents"
            />
          )}
          {(isAgent || isOwner || isComplianceOwner) && (
            <SideBarItem
              visual={<MonoAttachMoney />}
              label="Investors"
              component={Link}
              href="/investors"
            />
          )}

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
                  <Button isCompact variant="outlined">
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
