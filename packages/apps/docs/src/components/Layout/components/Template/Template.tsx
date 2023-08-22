import { Footer } from '../Footer';
import { Menu, MenuBack } from '../Menu';
import { SideMenu } from '../SideMenu';

import { useMenu } from '@/hooks';
import { IMenuItem } from '@/types/Layout';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  layout?: 'normal' | 'landing';
  hideSideMenu?: boolean;
}

export const Template: FC<IProps> = ({
  children,
  menuItems,
  layout = 'normal',
  hideSideMenu = false,
}) => {
  const { isMenuOpen, closeMenu } = useMenu();

  return (
    <>
      <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
      <Menu
        dataCy="menu"
        isOpen={isMenuOpen}
        inLayout={!hideSideMenu}
        layout={layout}
      >
        <SideMenu closeMenu={closeMenu} menuItems={menuItems} />
      </Menu>
      {children}
      <Footer />
    </>
  );
};
