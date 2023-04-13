import { MenuItems } from '../MenuItems';
import { InnerWrapper, Spacer, StyledHeader } from '../styles';
import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export const Header: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  const { hasPath, listRef, backgroundRef } = useHeaderAnimation();

  return (
    <StyledHeader>
      <InnerWrapper>
        <NavItemActiveBackground show={hasPath} ref={backgroundRef} />
        <DocsLogo overwriteTheme="dark" />
        <MenuItems ref={listRef} />
        <Spacer />
        <ThemeToggle />
        <HamburgerMenuToggle toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      </InnerWrapper>
    </StyledHeader>
  );
};
