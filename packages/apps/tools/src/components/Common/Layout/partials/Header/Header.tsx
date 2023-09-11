import { NavHeader } from '@kadena/react-ui';

import { walletConnectWrapperStyle } from '@/components/Common/Layout/partials/Header/styles.css';
import WalletConnectButton from '@/components/Common/WalletConnectButton';
import type { Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import routes from '@/constants/routes';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { IMenuItem } from '@/types/Layout';
import { getNetworks } from '@/utils/wallet';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface IHeaderProps {
  logo?: ReactNode;
  appTitle?: string;
  menu?: IMenuItem[];
  rightPanel?: ReactNode;
}

const Header: FC<IHeaderProps> = () => {
  const { t } = useTranslation('common');
  const { accounts, selectedNetwork, setSelectedNetwork, session } =
    useWalletConnectClient();
  const { pathname, push } = useRouter();

  const navItems = [
    {
      label: t('Faucet'),
      href: routes.FAUCET_EXISTING,
    },
    {
      label: t('Transactions'),
      href: routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      label: t('Account'),
      href: routes.ACCOUNT_TRANSACTIONS_FILTERS,
    },
  ];

  const networks: Network[] = session
    ? getNetworks(accounts)
    : ['mainnet01', 'testnet04'];

  const handleMenuItemClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
  ): Promise<void> => {
    e.preventDefault();

    await push(e.currentTarget.href);
  };

  return (
    <NavHeader.Root brand="DevTools">
      <NavHeader.Navigation
        activeLink={navItems.findIndex((item) => item.href === pathname) + 1}
      >
        {navItems.map((item, index) => (
          <NavHeader.Link key={index} onClick={handleMenuItemClick} asChild>
            <Link href={item.href}>{item.label}</Link>
          </NavHeader.Link>
        ))}
      </NavHeader.Navigation>
      <NavHeader.Content>
        <NavHeader.Select
          id="network-select"
          ariaLabel={t('Select Network')}
          value={selectedNetwork as string}
          onChange={(e) => setSelectedNetwork(e.target.value as Network)}
          icon="Earth"
        >
          {networks.map((network) => (
            <NavHeader.SelectOption key={network} value={network}>
              {kadenaConstants?.[network].label}
            </NavHeader.SelectOption>
          ))}
        </NavHeader.Select>
        <div className={walletConnectWrapperStyle}>
          <WalletConnectButton />
        </div>
      </NavHeader.Content>
    </NavHeader.Root>
  );
};

export default Header;
