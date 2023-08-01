import { IconButton, SystemIcon } from '@kadena/react-ui';

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
import {
  HeaderIconGroup,
  HeaderSocialIconGroup,
  HideOnMobile,
  SkipNav,
} from './styles';
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

        <HeaderSocialIconGroup>
          <IconButton
            as="a"
            href="https://twitter.com/kadena_io"
            title="Go to our Twitter"
            icon={SystemIcon.Twitter}
            color="inverted"
          />
          <IconButton
            as="a"
            href="https://github.com/kadena-community"
            title="Go to our Github"
            icon={SystemIcon.Github}
            color="inverted"
          />
        </HeaderSocialIconGroup>
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
