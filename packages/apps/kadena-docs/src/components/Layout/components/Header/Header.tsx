import { MenuItems } from '../MenuItems';
import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { InnerWrapper, Spacer, StyledHeader } from './styles';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export const Header: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  const { listRef, backgroundRef } = useHeaderAnimation();

  return (
    <StyledHeader>
      <InnerWrapper>
        <DocsLogo />
        <NavItemActiveBackground ref={backgroundRef} />
        <MenuItems ref={listRef} />
        <Spacer />
        <ThemeToggle />
        <HamburgerMenuToggle toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      </InnerWrapper>
    </StyledHeader>
  );
};
