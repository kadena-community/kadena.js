import { StyledNav, StyledUl } from '..';

import { NavItem } from './NavItem';

import React, { FC } from 'react';

interface IProps {
  ref?: React.ForwardedRef<HTMLUListElement>;
}

export const MenuItems: FC<IProps> = React.forwardRef((props = {}, ref) => {
  return (
    <StyledNav>
      <StyledUl ref={ref}>
        <NavItem href="/docs/pact">Pact</NavItem>
        <NavItem href="/docs/kadenajs">KadenaJS</NavItem>
        <NavItem href="/docs/chainweb">Chainweb</NavItem>
      </StyledUl>
    </StyledNav>
  );
});

MenuItems.displayName = 'MenuItems';
