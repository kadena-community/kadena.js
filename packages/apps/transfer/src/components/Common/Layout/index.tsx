import { Header } from './partials';
import {
  footerStyle,
  gridItemCollapsedSidebarStyle,
  gridItemMainStyle,
  gridItemMenuStyle,
  gridItemMiniMenuStyle,
  gridStyle,
  headerStyle,
} from './styles.css';

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
    <div>
      <header className={headerStyle}>
        <Header
          logo={<KLogoComponent width={32} height={32} />}
          appTitle={t('Developer Tools')}
          menu={menu}
          rightPanel={<WalletConnectButton />}
        />
      </header>
      <div className={gridStyle}>
        <nav className={gridItemMiniMenuStyle}></nav>
        <nav className={gridItemMenuStyle}></nav>
        <main className={gridItemMainStyle}>{children}</main>
        <aside className={gridItemCollapsedSidebarStyle}></aside>
      </div>
      <footer className={footerStyle}></footer>
    </div>
  );
};

export default Layout;
