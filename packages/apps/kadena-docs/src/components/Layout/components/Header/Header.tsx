import { IconButton, SystemIcons } from '@kadena/react-components';

import { MenuItems } from '../MenuItems';
import { InnerWrapper, Spacer, StyledHeader, StyledNav } from '../styles';
import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { HeaderIconGroup, HideOnMobile, SkipNav } from './styles';
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
      <SkipNav href="#maincontent">Skip to main content</SkipNav>
      <InnerWrapper>
        <HideOnMobile>
          <NavItemActiveBackground show={hasPath} ref={backgroundRef} />
          <DocsLogo overwriteTheme="dark" />
          <StyledNav>
            <MenuItems ref={listRef} />
          </StyledNav>
        </HideOnMobile>
        <Spacer />

        <HeaderIconGroup>
          <IconButton
            onClick={() => alert('todo, make an href')}
            title="Go to our Twitter"
            icon={SystemIcons.Twitter}
          />
          <IconButton
            onClick={() => alert('todo, make an href')}
            title="Go to our Github"
            icon={SystemIcons.Github}
          />
        </HeaderIconGroup>
        <HeaderIconGroup>
          <ThemeToggle />
          <HamburgerMenuToggle
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
          />
        </HeaderIconGroup>
      </InnerWrapper>
    </StyledHeader>
  );
};
