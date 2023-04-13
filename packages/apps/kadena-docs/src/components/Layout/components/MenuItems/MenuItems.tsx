import { NavItem } from '../Header/NavItem';
import { StyledUl, StyleNav } from '../Header/styles';

import React, { FC } from 'react';

interface IProps {
  ref?: React.ForwardedRef<HTMLUListElement>;
}

export const MenuItems: FC<IProps> = React.forwardRef((props, ref) => {
  return (
    <StyleNav>
      <StyledUl ref={ref}>
        <NavItem href="/docs/pact">Pact</NavItem>
        <NavItem href="/docs/kadenajs">KadenaJS</NavItem>
      </StyledUl>
    </StyleNav>
  );
});

MenuItems.displayName = 'MenuItems';
