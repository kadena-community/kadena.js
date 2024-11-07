import { Themes, useTheme } from '@kadena/kode-ui';
import { SideBarLayout } from '@kadena/kode-ui/patterns';
import { FC, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FooterNavigation } from './FooterNavigation';
import { SideBar } from './SideBar';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const innerLocation = useMemo(
    () => ({
      url: location.pathname,
      hash: location.hash,
      push: navigate,
    }),
    [location],
  );

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  return (
    <>
      <SideBarLayout
        location={innerLocation}
        sidebar={<SideBar />}
        footer={<FooterNavigation toggleTheme={toggleTheme} />}
      >
        <Outlet />
      </SideBarLayout>

      <div id="modalportal"></div>
    </>
  );
};
