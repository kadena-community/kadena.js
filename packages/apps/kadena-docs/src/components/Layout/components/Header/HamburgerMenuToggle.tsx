import { IconButton, styled, SystemIcons } from '@kadena/react-components';

import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const Button = styled(IconButton, {
  display: 'flex',
  '@md': {
    display: 'none',
  },
});

export const HamburgerMenuToggle: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  return (
    <Button
      title="Open the sidemenu"
      onClick={toggleMenu}
      icon={isMenuOpen ? SystemIcons.Close : SystemIcons.MenuOpen}
      color="$neutral4"
    />
  );
};
