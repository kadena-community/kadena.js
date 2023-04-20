import { IconButton, SystemIcons } from '@kadena/react-components';

import {
  InnerWrapper,
  Spacer,
  StyledHeader,
  StyledNav,
  StyledUl,
} from '../styles';
import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItem } from './NavItem';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { HeaderIconGroup, HideOnMobile, SkipNav } from './styles';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import { IMenuItem } from '@/types/Layout';
import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
  menuItems: IMenuItem[];
}

export const Header: FC<IProps> = ({ toggleMenu, isMenuOpen, menuItems }) => {
  const { hasPath, listRef, backgroundRef } = useHeaderAnimation();

  return (
    <StyledHeader>
      <SkipNav href="#maincontent">Skip to main content</SkipNav>
      <InnerWrapper>
        <DocsLogo overwriteTheme="dark" />
        <HideOnMobile>
          <NavItemActiveBackground show={hasPath} ref={backgroundRef} />
          <DocsLogo overwriteTheme="dark" />
          <StyledNav>
            <StyledUl ref={listRef}>
              {menuItems.map((item) => (
                <NavItem key={item.label} href={item.root}>
                  {item.label} {item.order}
                </NavItem>
              ))}
            </StyledUl>
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
