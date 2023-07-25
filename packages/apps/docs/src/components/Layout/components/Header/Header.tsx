import { IconButton, SystemIcons } from '@kadena/react-components';

import {
  InnerWrapper,
  NavLink,
  Spacer,
  StyledHeader,
  StyledLogoWrapper,
  StyledNav,
  StyledUl,
} from '../styles';
import { DocsLogo } from '..';

import { AsideToggle } from './AsideToggle';
import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { SearchButton } from './SearchButton';
import { HeaderIconGroup, HideOnMobile, SkipNav } from './styles';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import { useMenu } from '@/hooks';
import { IMenuItem, LayoutType } from '@/types/Layout';
import { isOneOfLayoutType } from '@/utils';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  menuItems: IMenuItem[];
  layout?: LayoutType;
}

export const Header: FC<IProps> = ({ menuItems, layout = 'full' }) => {
  const { hasPath, listRef, backgroundRef } = useHeaderAnimation();
  const { toggleMenu, isMenuOpen, toggleAside, isAsideOpen } = useMenu();

  return (
    <StyledHeader>
      <SkipNav href="#maincontent">Skip to main content</SkipNav>
      <InnerWrapper>
        <StyledLogoWrapper>
          <Link href="/" passHref>
            <DocsLogo overwriteTheme="dark" />
          </Link>
        </StyledLogoWrapper>

        <HideOnMobile>
          <NavItemActiveBackground show={hasPath} ref={backgroundRef} />
          <StyledNav>
            <StyledUl ref={listRef}>
              {menuItems.map((item) => (
                <li key={item.root}>
                  <NavLink href={item.root} active={item.isMenuOpen}>
                    {item.menu}
                  </NavLink>
                </li>
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
            color="inverted"
          />
          <IconButton
            onClick={() => alert('todo, make an href')}
            title="Go to our Github"
            icon={SystemIcons.Github}
            color="inverted"
          />
        </HeaderIconGroup>
        <HeaderIconGroup>
          <ThemeToggle />
          <HideOnMobile>
            <SearchButton />
          </HideOnMobile>
          <HamburgerMenuToggle
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
          />
          {isOneOfLayoutType(layout, 'code') && (
            <AsideToggle toggleAside={toggleAside} isAsideOpen={isAsideOpen} />
          )}
        </HeaderIconGroup>
      </InnerWrapper>
    </StyledHeader>
  );
};
