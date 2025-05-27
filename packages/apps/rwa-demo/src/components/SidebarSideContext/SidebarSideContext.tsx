import { useAccount } from '@/hooks/account';
import { useUser } from '@/hooks/user';
import { shortenString } from '@/utils/shortenString';
import {
  MonoAccountBox,
  MonoDarkMode,
  MonoLightMode,
  MonoLogout,
  MonoSettings,
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
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

export const SidebarSideContext: FC = () => {
  const { signOut, user, userToken } = useUser();
  const { account } = useAccount();
  const { theme, setTheme } = useTheme();
  const { isExpanded } = useSideBarLayout();
  const router = useRouter();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  const handleLogout = async () => {
    signOut();
    router.push('/');
  };

  return (
    <>
      <SideBarItem visual={<MonoAccountBox />} label="" onPress={() => {}}>
        account: {account?.alias}
      </SideBarItem>

      <SideBarItemsInline>
        <SideBarItem
          label=""
          visual={<MonoAccountBox />}
          onPress={handleLogout}
        >
          <ContextMenu
            trigger={
              <Button isCompact variant="outlined">
                {isExpanded ? (
                  shortenString(user?.displayName ?? '')
                ) : (
                  <MonoAccountBox />
                )}
              </Button>
            }
          >
            {userToken?.claims.rootAdmin ? (
              <ContextMenuItem
                label="root admin"
                onClick={() => {
                  router.push('/admin/root');
                }}
              />
            ) : null}
            {userToken?.claims.orgAdmin ? (
              <ContextMenuItem
                label="org. admin"
                onClick={() => {
                  router.push('/admin');
                }}
              />
            ) : null}
            <ContextMenuItem
              endVisual={<MonoSettings />}
              label="Settings"
              onClick={() => {
                router.push('/settings');
              }}
            />
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
  );
};
