import { NavLink } from '../NavLink';

import { StyledSidebar } from './styles';

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
      href: '/module-explorer',
    },
  ];

  return (
    <StyledSidebar>
      {menu.map((item, index) => (
        <NavLink key={index} href={item.href}>
          {item.title}
        </NavLink>
      ))}
    </StyledSidebar>
  );
};
