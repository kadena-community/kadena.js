import { HeaderMenuButton } from '@/components/Common/Layout/partials/Header/HeaderMenuButton';
import { walletConnectWrapperStyle } from '@/components/Common/Layout/partials/Header/styles.css';
import { AddNetworkModal } from '@/components/Global';
import type { Network } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useIsMatchingMediaQuery } from '@/hooks/use-is-mobile-media-query';
import type { IMenuItem } from '@/types/Layout';
import { getHref } from '@/utils/getHref';
import type { INetworkData } from '@/utils/network';
import { NavHeader } from '@kadena/react-ui';
import { breakpoints } from '@kadena/react-ui/theme';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';

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

  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const isMediumScreen = useIsMatchingMediaQuery(`${breakpoints.sm}`);

  const handleMenuItemClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
  ): Promise<void> => {
    e.preventDefault();

    await push(e.currentTarget.href);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openNetworkModal = () => setIsOpen(true);

  const handleOnChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    if ((e.target as HTMLSelectElement).value === 'custom') {
      return openNetworkModal();
    }
    setSelectedNetwork((e.target as HTMLSelectElement).value as Network);
  };

  const toggleTheme = (): void => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <>
      <NavHeader.Root brand={isMediumScreen ? 'DevTools' : 'Kadena'}>
        <NavHeader.Navigation activeHref={pathname}>
          {menuData.map((item, index) => (
            <NavHeader.Link
              key={index}
              href={getHref(pathname, item.href)}
              onClick={handleMenuItemClick}
              asChild
            >
              <Link href={getHref(pathname, item.href)}>{item.title}</Link>
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
            <option value="custom">{t('+ add network')}</option>
          </NavHeader.Select>
          <div className={walletConnectWrapperStyle}>
            {/*<WalletConnectButton />*/}
          </div>
        </NavHeader.Content>
      </NavHeader.Root>
      <AddNetworkModal
        isOpen={isOpen}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
      />
    </>
  );
};

export default Header;
