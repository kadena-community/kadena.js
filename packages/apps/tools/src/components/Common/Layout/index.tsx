import { Option, Select } from '@kadena/react-ui';

import { FooterWrapper, Header, Sidebar } from './partials';
import {
  footerStyle,
  gridItemMainStyle,
  headerStyle,
  rightPanelColsStyle,
  rightPanelStyle,
} from './styles.css';

import WalletConnectButton from '@/components/Common/WalletConnectButton';
import { GridCol, GridRow } from '@/components/Global';
import routes from '@/constants/routes';
import { useLayoutContext } from '@/context';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';
import { SystemIcons } from '@kadena/react-components';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const { t } = useTranslation('common');
  const { isMenuOpen } = useLayoutContext();
  const {
    accounts,
    selectedAccount,
    selectedChain,
    setSelectedAccount,
    setSelectedChain,
    session,
  } = useWalletConnectClient();

  const menu = [
    {
      title: t('Faucet'),
      href: routes.FAUCET_EXISTING,
    },
    {
      title: t('Transactions'),
      href: routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Account'),
      href: routes.ACCOUNT_TRANSACTIONS_FILTERS,
    },
  ];

  const getChains = (): string[] => {
    const result = new Set(
      accounts?.map((account) => {
        const [, chain] = account.split(':');
        return chain;
      }),
    );

    return Array.from(result) ?? [];
  };

  const getAccounts = (): string[] => {
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const regex = new RegExp(`kadena\:${selectedChain}.*`);
    const result = new Set(
      accounts
        ?.filter((account) => {
          if (account.match(regex)) return account;
        })
        ?.map((account) => {
          const [, , accountName] = account.split(':');
          return accountName;
        }),
    );

    return Array.from(result) ?? [];
  };

  return (
    <div>
      <header className={headerStyle}>
        <Header
          appTitle={t('Developer Tools')}
          menu={menu}
          rightPanel={
            <GridRow className={rightPanelStyle}>
              {session && (
                <>
                  <GridCol xs={6} lg={4} className={rightPanelColsStyle}>
                    <Select
                      ariaLabel={t('Select Chain')}
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      icon={SystemIcons.Link}
                    >
                      <Option value={undefined as string}>
                        {t('Select Chain')}
                      </Option>
                      {getChains().map((chain) => (
                        <Option key={chain} value={chain}>
                          {chain}
                        </Option>
                      ))}
                    </Select>
                  </GridCol>
                  <GridCol xs={6} lg={4} className={rightPanelColsStyle}>
                    <Select
                      ariaLabel={t('Select Account')}
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      icon={SystemIcons.KIcon}
                    >
                      <Option value={undefined as string}>
                        {t('Select Account')}
                      </Option>
                      {getAccounts().map((account) => (
                        <Option key={account} value={account}>
                          {account.slice(0, 4)}****{account.slice(-4)}
                        </Option>
                      ))}
                    </Select>
                  </GridCol>
                </>
              )}
              <GridCol
                xs={12}
                md={{ size: session ? 3 : 6, offset: session ? 0 : 6 }}
                lg={{ size: session ? 3 : 5}}
                className={rightPanelColsStyle}
              >
                <WalletConnectButton />
              </GridCol>
            </GridRow>
          }
        />
      </header>
      <Sidebar />
      <main className={classNames(gridItemMainStyle, { isMenuOpen })}>
        {children}
      </main>
      <div className={footerStyle}>
        <FooterWrapper />
      </div>
    </div>
  );
};

export default Layout;
