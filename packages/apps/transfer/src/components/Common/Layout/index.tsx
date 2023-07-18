import { Header } from './partials';

import { StyledLayout } from '@/components/Common/Layout/styles';
import { WalletConnectButton } from '@/components/Global';
import routes from '@/constants/routes';
import { KLogoComponent } from '@/resources/svg/generated';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';
import { IconButton } from '@kadena/react-ui';
import { SystemIcons } from '@kadena/react-components';
import Footer from '@/components/Common/Layout/partials/Footer/Footer';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const { t } = useTranslation('common');

  const menu = [
    {
      title: t('Home'),
      href: routes.HOME,
    },
    {
      title: t('Tracker'),
      href: routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Finisher'),
      href: routes.CROSS_CHAIN_TRANSFER_FINISHER,
    },
    {
      title: t('Transactions'),
      href: routes.ACCOUNT_TRANSACTIONS,
    },
    {
      title: t('Explorer'),
      href: routes.MODULE_EXPLORER,
    },
  ];
  return (
    <StyledLayout data-testid={'layout-container'} className="layout">
      <Header
        logo={<KLogoComponent width={32} height={32} />}
        appTitle={t('Developer Tools')}
        menu={menu}
        rightPanel={<WalletConnectButton />}
      />
      <main>{children}</main>
      <Footer />
    </StyledLayout>
  );
};

export default Layout;
