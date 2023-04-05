import { styled } from '@kadena/react-components';

import { NavItem } from './NavItem';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { useHeaderAnimation } from './useHeaderAnimation';

import { DocsLogo } from '@/components/DocsLogo';
import React, { FC } from 'react';

const StyledHeader = styled('header', {
  backgroundColor: '#1D1D1F',
  color: 'white',
});

const Wrapper = styled('div', {
  display: 'flex',
  margin: '0',
  padding: '10px 16px',

  '@lg': {
    margin: '0 200px',
  },
});

const StyleNav = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
});

const StyledUl = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

export const Header: FC = () => {
  const { listRef, backgroundRef } =
    useHeaderAnimation();

  return (
    <StyledHeader>
      <Wrapper>
        <DocsLogo />

        <NavItemActiveBackground ref={backgroundRef} />

        <StyleNav>
          <StyledUl ref={listRef}>
            <NavItem href="/docs/pact">
              Pact
            </NavItem>
            <NavItem href="/docs/kadenajs" >
              KadenaJS
            </NavItem>
            
          </StyledUl>
        </StyleNav>
      </Wrapper>
    </StyledHeader>
  );
};
