import React, { FC } from 'react';
import { styled } from '@kadena/react-components';
import { DocsLogo } from '@/components/DocsLogo';
import { NavItem } from './NavItem';
import { useHeaderAnimation } from './useHeaderAnimation';
import { NavItemActiveBackground } from './NavItemActiveBackground';

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
  const { handleSelectItem, listRef, backgroundRef, active } =
    useHeaderAnimation();

  return (
    <StyledHeader>
      <Wrapper>
        <DocsLogo />

        <NavItemActiveBackground ref={backgroundRef} />

        <StyleNav>
          <StyledUl ref={listRef} onClick={handleSelectItem}>
            <NavItem href="/docs/pact" active={active === 0}>
              Pact
            </NavItem>
            <NavItem href="/docs/kadenajs" active={active === 1}>
              KadenaJS
            </NavItem>
            <NavItem href="/docs/pact" active={active === 2}>
              Pact
            </NavItem>
            <NavItem href="/docs/kadenajs" active={active === 3}>
              KadenaJS
            </NavItem>
            <NavItem href="/docs/pact" active={active === 4}>
              Pact
            </NavItem>
            <NavItem href="/docs/kadenajs" active={active === 5}>
              KadenaJS
            </NavItem>
          </StyledUl>
        </StyleNav>
      </Wrapper>
    </StyledHeader>
  );
};
