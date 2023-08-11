import { Option, Select, SystemIcon } from '@kadena/react-ui';

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
import { kadenaConstants, Network } from '@/constants/kadena';
import routes from '@/constants/routes';
import { useLayoutContext } from '@/context';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const { t } = useTranslation('common');
  const { isMenuOpen } = useLayoutContext();
  const { accounts, selectedNetwork, setSelectedNetwork, session } =
    useWalletConnectClient();

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

  const getNetworks = (): Network[] => {
    if (!session) return ['mainnet01', 'testnet04'];

    const result = new Set(
      accounts
        ?.map((account) => {
          const [, network] = account.split(':');
          return network;
        })
        ?.filter((network) => network !== 'development'),
    );

    return Array.from(result ?? []) as Network[];
  };

  return (
    <div>
      <header className={headerStyle}>
        <Header
          appTitle={t('Developer Tools')}
          menu={menu}
          rightPanel={
            <GridRow className={rightPanelStyle}>
              <GridCol xs={6} lg={4} className={rightPanelColsStyle}>
                <Select
                  ariaLabel={t('Select Network')}
                  value={selectedNetwork as string}
                  onChange={(e) =>
                    setSelectedNetwork(e.target.value as Network)
                  }
                  icon={SystemIcon.Link}
                >
                  {getNetworks().map((network) => (
                    <Option key={network} value={network}>
                      {kadenaConstants?.[network].label}
                    </Option>
                  ))}
                </Select>
              </GridCol>
              <GridCol
                xs={12}
                md={{ size: session ? 3 : 6 }}
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
