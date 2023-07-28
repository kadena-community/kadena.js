import { NavLink } from '@/components/Global/NavLink';
import { StyledSidebar } from '@/components/Global/SidebarMenu/styles';
import routes from '@/constants/routes';
import { Account, Chain } from '@/resources/svg/generated';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

export const SidebarMenu: FC = (props) => {
  const { t } = useTranslation('common');
  const { pathname } = useRouter();
  const firstPath = pathname.split('/')[1];

  const menuItems: {
    [key: string]: Array<{ icon: unknown; title: string; href: string }>;
  } = {
    transfer: [
      {
        icon: Chain,
        title: t('Cross Chain Transfer Tracker'),
        href: routes.CROSS_CHAIN_TRANSFER_TRACKER,
      },
      {
        icon: Chain,
        title: t('Cross Chain Transfer Finisher'),
        href: routes.CROSS_CHAIN_TRANSFER_FINISHER,
      },
      {
        icon: Account,
        title: t('Account Transactions'),
        href: routes.ACCOUNT_TRANSACTIONS,
      },
      {
        icon: Chain,
        title: t('Module explorer'),
        href: routes.MODULE_EXPLORER,
      },
    ],
    faucet: [
      {
        icon: Account,
        title: t('Existing account'),
        href: routes.FAUCET_EXISTING,
      },
    ],
  };
  const menu = menuItems[firstPath];

  return (
    <StyledSidebar data-testid={'navigation'}>
      {menu.map((item, index) => (
        <NavLink key={index} href={item.href}>
          {item.title}
        </NavLink>
      ))}
    </StyledSidebar>
  );
};
