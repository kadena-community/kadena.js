import { NavLink } from '../NavLink';

import { StyledSidebar } from './styles';

import { Account, Chain } from '@/resources/svg/generated';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

export const SidebarMenu: FC = (props) => {
  const { t } = useTranslation('common');
  const { pathname } = useRouter();
  const firstPath = pathname.split('/')[1];

  const menuItems: {
    [key: string]: Array<{ icon: any; title: string; href: string }>;
  } = {
    transfer: [
      {
        icon: Chain,
        title: t('Cross Chain Transfer Tracker'),
        href: '/transfer/cross-chain-transfer-tracker',
      },
      {
        icon: Chain,
        title: t('Cross Chain Transfer Finisher'),
        href: '/transfer/cross-chain-transfer-finisher',
      },
      {
        icon: Chain,
        title: t('Module explorer'),
        href: '/transfer/module-explorer',
      },
    ],
    faucet: [
      {
        icon: Account,
        title: t('Existing account'),
        href: '/',
      },
      {
        icon: Chain,
        title: t('New account'),
        href: '/',
      },
    ],
  };
  const menu = menuItems[firstPath];

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
