import { HeaderMenuButton } from '@/components/Common/Layout/partials/Header/HeaderMenuButton';
import { walletConnectWrapperStyle } from '@/components/Common/Layout/partials/Header/styles.css';
import WalletConnectButton from '@/components/Common/WalletConnectButton';
import type { Network } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { IMenuItem } from '@/types/Layout';
import type { INetworkData } from '@/utils/network';
import { NavHeader } from '@kadena/react-ui';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const { selectedNetwork, networksData, setSelectedNetwork } = useWalletConnectClient();
  const { pathname, push } = useRouter();

  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleMenuItemClick = async (e: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
    e.preventDefault();

    await push(e.currentTarget.href);
  };

  const handleOnChange = (e: React.FormEvent<HTMLSelectElement>): void =>
    setSelectedNetwork((e.target as HTMLSelectElement).value as Network);

  const toggleTheme = (): void => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const getHref = (itemHref?: string): string => {
    if (!itemHref) return '#';
    const basePath = pathname.split('/')[1];

    if (!basePath) {
      const currentItem = menuData.find((item) => item.href === itemHref);
      return currentItem?.items ? currentItem.items[0].href : '#';
    }

    const itemFromMenu = menuData.find((item) => item.href === basePath);

    if (!itemFromMenu) return '#';

    const activeHref = itemFromMenu.items?.find((item) => item.href === pathname);

    if (!activeHref) return '#';

    return activeHref.href;
  };

  return (
    <NavHeader.Root brand="DevTools">
      <NavHeader.Navigation activeHref={pathname}>
        {menuData.map((item, index) => (
          <NavHeader.Link
            key={index}
            href={getHref(item.href)}
            onClick={handleMenuItemClick}
            asChild
          >
            <Link href={getHref(item.href)}>{item.title}</Link>
          </NavHeader.Link>
        ))}
      </NavHeader.Navigation>
      <NavHeader.Content>
        <HeaderMenuButton
          title={'Toggle theme'}
          icon={'ThemeLightDark'}
          onClick={() => toggleTheme()}
        />
        <NavHeader.Select
          id="network-select"
          ariaLabel={t('Select Network')}
          value={selectedNetwork as string}
          onChange={(e) => handleOnChange(e)}
          icon="Earth"
        >
          {networksData.map((network: INetworkData) => (
            <option
              key={network.networkId}
              value={network.networkId}
              disabled={network.networkId === 'mainnet01'}
            >
              {network.label}
            </option>
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
