import { useUser } from '@/hooks/user';
import { shortenString } from '@/utils/shortenString';
import { MonoAccountBox, MonoLogout, MonoSettings } from '@kadena/kode-icons';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuItem,
  Stack,
  ThemeAnimateIcon,
  useTheme,
} from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBarItemsInline,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

import './style.css';

export const SidebarSideContext: FC = () => {
  const { signOut, userToken, userData } = useUser();
  const { theme, rotateTheme } = useTheme();
  const { isExpanded } = useSideBarLayout();
  const router = useRouter();

  const handleLogout = async () => {
    signOut();
    router.push('/');
  };

  return (
    <>
      <SideBarItemsInline>
        <SideBarItem
          label=""
          visual={<MonoAccountBox />}
          onPress={handleLogout}
        >
          <Stack width="100%" data-isexpanded={isExpanded}>
            <ButtonGroup fullWidth>
              <ContextMenu
                trigger={
                  <Button
                    isCompact
                    variant={isExpanded ? 'outlined' : 'transparent'}
                  >
                    {isExpanded ? (
                      shortenString(userData?.data?.displayName ?? '')
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
                {userToken?.claims.orgAdmins ? (
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
              <Button
                isCompact
                variant={isExpanded ? 'outlined' : 'transparent'}
                onPress={rotateTheme}
                startVisual={<ThemeAnimateIcon theme={theme} />}
              />
            </ButtonGroup>
          </Stack>
        </SideBarItem>
      </SideBarItemsInline>
    </>
  );
};
