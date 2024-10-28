import { backgroundStyle, mainColumnStyle } from '@/App/layout.css.ts';
import { MainHeader } from '@/Components/MainHeader/MainHeader';
import { Sidebar } from '@/Components/Sidebar/Sidebar.tsx';
import { pageClass } from '@/pages/home/style.css.ts';
import {
  MonoContacts,
  MonoContrast,
  MonoDataThresholding,
  MonoKey,
  MonoNetworkCheck,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoTerminal,
  MonoTextSnippet,
} from '@kadena/kode-icons/system';

import { Box, Button, Link, Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBar,
  SideBarContext,
  SideBarItem,
  SideBarItemsInline,
  SideBarLayout,
  SideBarNavigation,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { BetaHeader } from './BetaHeader';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };
  return (
    <>
      <SideBarLayout topBanner={<BetaHeader />}>
        <SideBar>
          <SideBarNavigation>
            <SideBarItem visual={<MonoDataThresholding />}>
              <RouterLink to="/">
                <Link startVisual={<MonoDataThresholding />} variant="outlined">
                  Dashboard
                </Link>
              </RouterLink>
            </SideBarItem>

            <SideBarItem visual={<MonoSignature />}>
              <RouterLink to="/sig-builder">
                <Link startVisual={<MonoSignature />}>Sig Builder</Link>
              </RouterLink>
            </SideBarItem>

            <SideBarItem visual={<MonoSwapHoriz />}>
              <RouterLink to="/transfer">
                <Link startVisual={<MonoSwapHoriz />}>Transfer</Link>
              </RouterLink>
            </SideBarItem>
            <SideBarItem visual={<MonoTableRows />}>
              <RouterLink to="/transactions">
                <Link startVisual={<MonoTableRows />}>Transactions</Link>
              </RouterLink>
            </SideBarItem>
            <SideBarItem visual={<MonoContacts />}>
              <RouterLink to="/contacts">
                <Link startVisual={<MonoContacts />}>Contacts</Link>
              </RouterLink>
            </SideBarItem>

            <SideBarItem visual={<MonoNetworkCheck />}>
              <RouterLink to="/networks">
                <Link startVisual={<MonoNetworkCheck />}>Networks</Link>
              </RouterLink>
            </SideBarItem>
            <SideBarItem visual={<MonoTextSnippet />}>
              <RouterLink to="/backup-recovery-phrase/write-down">
                <Link startVisual={<MonoTextSnippet />}>Backup</Link>
              </RouterLink>
            </SideBarItem>
            <SideBarItem visual={<MonoKey />}>
              <RouterLink to="/key-management/keys">
                <Link startVisual={<MonoKey />}>Keys</Link>
              </RouterLink>
            </SideBarItem>
            <SideBarItem visual={<MonoTerminal />}>
              <RouterLink to="/terminal">
                <Link startVisual={<MonoTerminal />}>Dev Console</Link>
              </RouterLink>
            </SideBarItem>
          </SideBarNavigation>

          <SideBarContext>
            <SideBarItemsInline>
              <SideBarItem visual={<MonoTerminal />}>
                <Button
                  onPress={() => toggleTheme()}
                  endVisual={<MonoContacts />}
                >
                  Profile
                </Button>
              </SideBarItem>
              <SideBarItem visual={<MonoTerminal />}>
                <Button
                  onPress={() => toggleTheme()}
                  startVisual={<MonoContrast />}
                />
              </SideBarItem>
            </SideBarItemsInline>
          </SideBarContext>
        </SideBar>
        <main
          style={{ gridArea: 'sidebarlayout-main', backgroundColor: 'green' }}
        >
          <Outlet />
        </main>
      </SideBarLayout>
      <MainHeader />
      <main>
        <Stack
          className={pageClass}
          style={
            {
              // backgroundImage: `radial-gradient(circle farthest-side at 50% 170%, ${accentColor}, transparent 75%)`,
            }
          }
        >
          <Sidebar></Sidebar>
          <Box padding="n10" className={mainColumnStyle}>
            <div className={backgroundStyle}></div>
            <Outlet />
          </Box>
        </Stack>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
