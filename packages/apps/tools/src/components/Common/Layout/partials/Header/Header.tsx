import { walletConnectWrapperStyle } from '@/components/Common/Layout/partials/Header/styles.css';
import { AddNetworkModal } from '@/components/Global';
import { OptionsModal } from '@/components/Global/OptionsModal';
import type { Network } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useIsMatchingMediaQuery } from '@/hooks/use-is-mobile-media-query';
import type { IMenuItem } from '@/types/Layout';
import { getHref } from '@/utils/getHref';
import type { INetworkData } from '@/utils/network';
import {
  KadenaLogo,
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  SystemIcon,
} from '@kadena/react-ui';
import { atoms, breakpoints } from '@kadena/react-ui/styles';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { Logo } from './Logo';

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
  const { pathname } = useRouter();

  const { systemTheme, theme, setTheme } = useTheme();

  const isMediumScreen = useIsMatchingMediaQuery(`${breakpoints.sm}`);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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

  const handleDevOptionsClick = (): void => {
    setOpenModal(true);
  };

  return (
    <>
      <NavHeader
        logo={
          <Link href={'/'}>
            {isMediumScreen ? <Logo /> : <KadenaLogo height={33} />}
          </Link>
        }
        activeHref={pathname}
      >
        <NavHeaderLinkList>
          {menuData.map((item, index) => (
            <NavHeaderLink key={index} asChild>
              <Link href={getHref(item.href)}>{item.title}</Link>
            </NavHeaderLink>
          ))}
        </NavHeaderLinkList>
        <NavHeaderButton
          aria-label="Toggle theme"
          icon={<SystemIcon.ThemeLightDark />}
          onClick={() => toggleTheme()}
          className={atoms({ marginInlineEnd: 'sm' })}
        />
        <NavHeaderButton
          aria-label={'Application Settings'}
          icon={<SystemIcon.ProgressWrench />}
          onClick={() => handleDevOptionsClick()}
          className={atoms({ marginInlineEnd: 'sm' })}
        />
        <NavHeaderSelect
          id="network-select"
          ariaLabel={t('Select Network')}
          value={selectedNetwork as string}
          onChange={(e) => handleOnChange(e)}
          icon="Earth"
        >
          {...networksData.map((network: INetworkData) => (
            <SelectItem key={network.networkId} textValue={network.networkId}>
              {network.label}
            </SelectItem>
          ))}
          <SelectItem key="custom" textValue="custom">
            {t('+ add network')}
          </SelectItem>
        </NavHeaderSelect>
        {/* <div className={walletConnectWrapperStyle}>
        <WalletConnectButton />
      </div> */}
      </NavHeader>
      <AddNetworkModal
        isOpen={isOpen}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
      />
      <OptionsModal
        isOpen={openModal}
        onOpenChange={() => setOpenModal(false)}
      />
    </>
  );
};

export default Header;
