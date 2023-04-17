import { IconButton, styled, SystemIcons } from '@kadena/react-components';

import {
  InnerWrapper,
  Spacer,
  StyledHeader,
  StyledNav,
  StyledUl,
} from '../styles';
import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import Link from 'next/link';
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
  transition: 'transform .1s ease-in, opacity .1s ease-in',
  opacity: 0,
  '&:focus': {
    transform: 'translateY(0px)',
    opacity: 1,
  },
});

const HeaderIconGroup = styled('div', {
  display: 'flex',
  marginLeft: '$6',
});

const HideOnMobile = styled('div', {
  display: 'none',
  '@md': {
    display: 'flex',
  },
});

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
            <StyledUl ref={listRef}>
              <li>
                <Link href="/docs/pact">Pact</Link>
              </li>
              <li>
                <Link href="/docs/kadenajs">KadenaJS</Link>
              </li>
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
