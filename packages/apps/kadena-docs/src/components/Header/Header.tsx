import { NavItem } from './NavItem';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { StyledHeader, StyledUl, StyleNav, Wrapper } from './styles';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import { DocsLogo } from '@/components/DocsLogo';
import React, { FC } from 'react';

export const Header: FC = () => {
  const { listRef, backgroundRef } = useHeaderAnimation();

  return (
    <StyledHeader>
      <Wrapper>
        <DocsLogo />

        <NavItemActiveBackground ref={backgroundRef} />

        <StyleNav>
          <StyledUl ref={listRef}>
            <NavItem href="/docs/pact">Pact</NavItem>
            <NavItem href="/docs/kadenajs">KadenaJS</NavItem>
          </StyledUl>
        </StyleNav>

        <ThemeToggle />
      </Wrapper>
    </StyledHeader>
  );
};
