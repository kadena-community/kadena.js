import { FooterWrapper, Header, Sidebar } from './partials';
import {
  footerStyle,
  gridItemCollapsedSidebarStyle,
  gridItemMainStyle,
  headerStyle,
} from './styles.css';

import { WalletConnectButton } from '@/components/Global';
import routes from '@/constants/routes';
import { useLayoutContext } from '@/context';
import { KLogoComponent } from '@/resources/svg/generated';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const { t } = useTranslation('common');
  const { isMenuOpen } = useLayoutContext();

  const menu = [
    {
      title: t('Faucet'),
      href: routes.FAUCET_EXISTING,
    },
    {
      title: t('Transactions'),
      href: routes.ACCOUNT_TRANSACTIONS,
    },
    {
      title: t('Balance'),
      href: routes.BALANCE,
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
      <Sidebar />
      <main className={classNames(gridItemMainStyle, { isMenuOpen })}>
        {children}
      </main>
      <aside className={gridItemCollapsedSidebarStyle}></aside>
      <div className={footerStyle}>
        <FooterWrapper />
      </div>
    </div>
  );
};

export default Layout;
