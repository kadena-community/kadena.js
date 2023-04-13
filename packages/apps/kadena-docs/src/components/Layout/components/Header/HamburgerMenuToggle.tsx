import { Icons } from '@kadena/react-components';

import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export const HamburgerMenuToggle: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  return (
    <button onClick={toggleMenu}>
      {isMenuOpen ? null : <Icons.MenuOpenIcon />}
    </button>
  );
};
