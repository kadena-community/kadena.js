import { StyledNav, StyledUl } from '..';

import { NavItem } from './NavItem';

import menuItems from '@/data/menu.json';
import React, { FC } from 'react';

interface IProps {
  ref?: React.ForwardedRef<HTMLUListElement>;
}

export const MenuItems: FC<IProps> = React.forwardRef((props = {}, ref) => {
  return (
    <StyledNav>
      <StyledUl ref={ref}>
        {menuItems.map((item) => (
          <NavItem key={item.label} href={item.root}>
            {item.label}
          </NavItem>
        ))}
      </StyledUl>
    </StyledNav>
  );
});

MenuItems.displayName = 'MenuItems';
