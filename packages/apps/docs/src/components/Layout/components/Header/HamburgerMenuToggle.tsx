import { SystemIcon } from '@kadena/react-ui';

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
      icon={isMenuOpen ? SystemIcon.Close : SystemIcon.MenuOpen}
      color="inverted"
    />
  );
};
