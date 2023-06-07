import { Button, TextField } from '@kadena/react-components';

import {
  StyledNavItem,
  StyledNavItemIcon,
  StyledNavItemSelectedText,
  StyledNavItemText,
  StyledSelectedNavItem,
  StyledSidebar,
} from './styles';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Account, Chain, Key } from '@/resources/svg/generated';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';

export const SidebarMenu: FC = (props) => {
  const { pathname } = useRouter();
  console.log('PATHNAAAME', pathname);

  const menu = [
    {
      icon: Chain,
      title: 'Cross-chain Transfer Tracker',
      href: '/cross-chain-transfer-tracker',
    },
    {
      icon: Chain,
      title: 'Cross-chain Transfer Finisher',
      href: '/cross-chain-transfer-finisher',
    },
    {
      icon: Chain,
      title: 'Module explorer',
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
