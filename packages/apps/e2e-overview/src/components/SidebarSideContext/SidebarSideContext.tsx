import { useUser } from '@/hooks/user';
import { MonoAccountBox, MonoLogout } from '@kadena/kode-icons';
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
import type { FC } from 'react';

import { shortenString } from '@/utils/shortenString';
import './style.css';

export const SidebarSideContext: FC = () => {
  const { signOut, user } = useUser();
  const { theme, rotateTheme } = useTheme();
  const { isExpanded } = useSideBarLayout();

  const handleLogout = async () => {
    signOut();
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
                    textAlign={isExpanded ? 'start' : 'center'}
                    isCompact
                    variant={isExpanded ? 'outlined' : 'transparent'}
                  >
                    {isExpanded ? (
                      shortenString(user?.email ?? '')
                    ) : (
                      <MonoAccountBox />
                    )}
                  </Button>
                }
              >
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
