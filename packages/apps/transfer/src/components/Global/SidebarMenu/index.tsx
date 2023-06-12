import { NavLink } from '../NavLink';

import { StyledSidebar } from './styles';

import { Chain } from '@/resources/svg/generated';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

export const SidebarMenu: FC = (props) => {
  const { t } = useTranslation('common');
  const { pathname } = useRouter();

  const menu = [
    {
      icon: Chain,
      title: t('Cross Chain Transfer Tracker'),
      href: '/cross-chain-transfer-tracker',
    },
    {
      icon: Chain,
      title: t('Cross Chain Transfer Finisher'),
      href: '/cross-chain-transfer-finisher',
    },
    {
      icon: Chain,
      title: t('Module explorer'),
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
