import React, { FC } from 'react';
import { styled } from '@kadena/react-components';
import { DocsLogo } from '@/components/DocsLogo';
import Link from 'next/link';

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

const StyledNav = styled('ul', {
  padding: 0,
  listStyle: 'none',
});

const NavLink = styled(Link, {
  color: 'white',
  fontFamily: '$main',
});

export const Header: FC = () => {
  return (
    <StyledHeader>
      <Wrapper>
        <DocsLogo />

        <nav>
          <StyledNav>
            <li>
              <NavLink href="/docs/pact">Pact</NavLink>
              <NavLink href="/docs/kadenajs">KadenaJS</NavLink>
              <NavLink href="/docs/chainweaver">Chainweaver</NavLink>
              <NavLink href="/docs/apis">Apis</NavLink>
              <NavLink href="/docs/academy">Academy</NavLink>
              <NavLink href="/docs/support">Support</NavLink>
              <NavLink href="/docs/blog">Blog</NavLink>
            </li>
          </StyledNav>
        </nav>
      </Wrapper>
    </StyledHeader>
  );
};
