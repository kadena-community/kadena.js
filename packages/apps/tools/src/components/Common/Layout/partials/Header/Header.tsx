import { NavHeader, useModal } from '@kadena/react-ui';

import { walletConnectWrapperStyle } from '@/components/Common/Layout/partials/Header/styles.css';
import WalletConnectButton from '@/components/Common/WalletConnectButton';
import { AddNetworkModal } from '@/components/Global/AddNetworkModal';
import type { Network } from '@/constants/kadena';
import routes from '@/constants/routes';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { IMenuItem } from '@/types/Layout';
import type { INetworkData } from '@/utils/network';
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
  const { selectedNetwork, networksData, setSelectedNetwork } =
    useWalletConnectClient();
  const { pathname, push } = useRouter();
  const { renderModal } = useModal();

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

  const handleMenuItemClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
  ): Promise<void> => {
    e.preventDefault();

    await push(e.currentTarget.href);
  };

  const openNetworkModal = (): void =>
    renderModal(<AddNetworkModal />, 'Add Network');

  const handleOnChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    if ((e.target as HTMLSelectElement).value === 'custom') {
      return openNetworkModal();
    }
    setSelectedNetwork((e.target as HTMLSelectElement).value as Network);
  };

  console.log({ pathname });

  return (
    <NavHeader.Root brand="DevTools">
      <NavHeader.Navigation activeHref={pathname}>
        {navItems.map((item, index) => (
          <NavHeader.Link
            key={index}
            href={item.href}
            onClick={handleMenuItemClick}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </NavHeader.Link>
        ))}
      </NavHeader.Navigation>
      <NavHeader.Content>
        <NavHeader.Select
          id="network-select"
          ariaLabel={t('Select Network')}
          value={selectedNetwork as string}
          onChange={(e) => handleOnChange(e)}
          icon="Earth"
        >
          {networksData.map((network: INetworkData) => (
            <option key={network.networkId} value={network.networkId}>
              {network.label}
            </option>
          ))}
          <option value="custom">{t('+ add network')}</option>
        </NavHeader.Select>
        <div className={walletConnectWrapperStyle}>
          <WalletConnectButton />
        </div>
      </NavHeader.Content>
    </NavHeader.Root>
  );
};

export default Header;
