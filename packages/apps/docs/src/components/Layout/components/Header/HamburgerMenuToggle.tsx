import { SystemIcons } from '@kadena/react-components';

import { HamburgerButton } from './styles';

import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export const HamburgerMenuToggle: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  return (
    <HamburgerButton
      data-cy="hamburgermenu"
      title="Open the sidemenu"
      onClick={toggleMenu}
      icon={isMenuOpen ? SystemIcons.Close : SystemIcons.MenuOpen}
      color="inverted"
    />
  );
};
