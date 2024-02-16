import { useLayoutContext } from '@/context';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React, { useEffect } from 'react';
import { Header, Sidebar } from './partials';
import {
  gridItemMainStyle,
  headerStyle,
  mainStyle,
  sidebarStyle,
} from './styles.css';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const { isMenuOpen, setActiveMenuIndex, setIsMenuOpen } = useLayoutContext();

  useEffect(() => {
    // sidebar menu closed by default on smaller screens
    if (window.innerWidth < 768) {
      setActiveMenuIndex(undefined);
      setIsMenuOpen(false);
    }
  }, [setActiveMenuIndex, setIsMenuOpen]);

  return (
    <div data-testid="layout-container">
      <header className={headerStyle}>
        <Header />
      </header>
      <aside className={classNames(sidebarStyle, { isMenuOpen })}>
        <Sidebar />
      </aside>
      <main className={mainStyle}>
        <div className={classNames(gridItemMainStyle, { isMenuOpen })}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
