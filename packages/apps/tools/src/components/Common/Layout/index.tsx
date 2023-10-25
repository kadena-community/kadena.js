import { useLayoutContext } from '@/context';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { FooterWrapper, Header, Sidebar } from './partials';
import { footerStyle, gridItemMainStyle, headerStyle } from './styles.css';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const { isMenuOpen } = useLayoutContext();

  return (
    <div data-testid="layout-container">
      <header className={headerStyle}>
        <Header />
      </header>
      <Sidebar />
      <main className={classNames(gridItemMainStyle, { isMenuOpen })}>
        {children}
      </main>
      <div className={footerStyle}>
        <FooterWrapper />
      </div>
    </div>
  );
};

export default Layout;
