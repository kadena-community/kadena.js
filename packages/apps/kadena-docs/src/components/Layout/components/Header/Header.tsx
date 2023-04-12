import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItem } from './NavItem';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { InnerWrapper, StyledHeader, StyledUl, StyleNav } from './styles';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import React, { FC } from 'react';

export const Header: FC = () => {
  const { listRef, backgroundRef } = useHeaderAnimation();

  return (
    <StyledHeader>
      <InnerWrapper>
        <DocsLogo />
        <NavItemActiveBackground ref={backgroundRef} />
        <StyleNav>
          <StyledUl ref={listRef}>
            <NavItem href="/docs/pact">Pact</NavItem>
            <NavItem href="/docs/kadenajs">KadenaJS</NavItem>
          </StyledUl>
        </StyleNav>
        <ThemeToggle />
        <HamburgerMenuToggle />
      </InnerWrapper>
    </StyledHeader>
  );
};
