import { styled } from '@kadena/react-components';

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

const SkipNav = styled('a', {
  position: 'absolute',
  top: '0',
  left: 0,
  background: 'red',
  padding: '$2 $4',
  zIndex: '$modal',
  color: '$neutral6',
  fontWeight: '$bold',
  transform: 'translateY(-40px)',
  transition: 'transform .1s ease-in',
  '&:focus': {
    transform: 'translateY(0px)',
  },
});

export const Header: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  const { hasPath, listRef, backgroundRef } = useHeaderAnimation();

  return (
    <StyledHeader>
      <SkipNav href="#maincontent">Skip to main content</SkipNav>
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
