import { BaseTemplate, Footer, Header } from '../components';

import { IPageProps } from '@/types/Layout';
import React, { FC, useState } from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
    setIsAsideOpen(false);
  };

  const toggleAside = (): void => {
    setIsAsideOpen((v) => !v);
    setIsMenuOpen(false);
  };

  return (
    <BaseTemplate>
      <Header
        toggleMenu={toggleMenu}
        toggleAside={toggleAside}
        isMenuOpen={isMenuOpen}
        isAsideOpen={isAsideOpen}
        menuItems={leftMenuTree}
      />
      {children}
      <Footer />
    </BaseTemplate>
  );
};

Home.displayName = 'Home';
