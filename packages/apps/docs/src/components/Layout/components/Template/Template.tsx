import { Footer } from '../Footer';
import { Header } from '../Header';
import { SideMenu } from '../SideMenu';
import { Menu, MenuBack } from '../styles';

import { IMenuItem } from '@/types/Layout';
import React, { FC, ReactNode, useState } from 'react';

interface IProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
}

export const Template: FC<IProps> = ({ children, menuItems }) => {
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

  const closeMenu = (): void => setIsMenuOpen(false);

  return (
    <>
      <Header
        toggleMenu={toggleMenu}
        toggleAside={toggleAside}
        isMenuOpen={isMenuOpen}
        isAsideOpen={isAsideOpen}
        menuItems={menuItems}
      />
      <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
      <Menu data-cy="menu" isOpen={isMenuOpen} inLayout={true} layout="normal">
        <SideMenu closeMenu={closeMenu} menuItems={menuItems} />
      </Menu>
      {children}
      <Footer />
    </>
  );
};
