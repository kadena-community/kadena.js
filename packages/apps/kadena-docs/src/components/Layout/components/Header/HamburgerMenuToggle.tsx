import { Icons, styled } from '@kadena/react-components';

import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const Button = styled('button', {
  display: 'block',
  '@md': {
    display: 'none',
  },
});

export const HamburgerMenuToggle: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  return (
    <Button onClick={toggleMenu}>
      {isMenuOpen ? <Icons.CloseIcon /> : <Icons.MenuOpenIcon />}
    </Button>
  );
};
