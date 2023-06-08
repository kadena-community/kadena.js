import {
  StyledNavItem,
  StyledNavItemSelectedText,
  StyledNavItemText,
  StyledSelectedNavItem,
  StyledSidebar,
} from './styles';

import { Chain } from '@/resources/svg/generated';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

export const SidebarMenu: FC = (props) => {
  const { pathname } = useRouter();

  const menu = [
    {
      icon: Chain,
      title: 'Cross Chain Transfer Tracker',
      href: '/cross-chain-transfer-tracker',
    },
    {
      icon: Chain,
      title: 'Cross Chain Transfer Finisher',
      href: '/cross-chain-transfer-finisher',
    },
    {
      icon: Chain,
      title: 'Module Explorer',
      href: '/code-viewer',
    },
  ];

  return (
    <StyledSidebar>
      {menu.map((item, index) => (
        <div key={index}>
          {item.href === pathname ? (
            <StyledSelectedNavItem href={item.href}>
              <StyledNavItemSelectedText>
                {item.title}
              </StyledNavItemSelectedText>
            </StyledSelectedNavItem>
          ) : (
            <StyledNavItem href={item.href}>
              <StyledNavItemText>{item.title}</StyledNavItemText>
            </StyledNavItem>
          )}
        </div>
      ))}
    </StyledSidebar>
  );
};
