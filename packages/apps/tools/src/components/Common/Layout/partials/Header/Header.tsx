import { AddNetworkModal } from '@/components/Global';
import { OptionsModal } from '@/components/Global/OptionsModal';
import type { NetworkId, NetworkIds } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useIsMatchingMediaQuery } from '@/hooks/use-is-mobile-media-query';
import type { IMenuItem } from '@/types/Layout';
import { getHref } from '@/utils/getHref';
import type { INetworkData } from '@/utils/network';
import {
  MonoBuildCircle,
  MonoContrast,
  MonoPublic,
} from '@kadena/kode-icons/system';
import {
  KadenaLogo,
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
} from '@kadena/kode-ui';
import { atoms, breakpoints } from '@kadena/kode-ui/styles';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { Logo } from './Logo';
import { rightSideMenu } from './styles.css';

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

  const handleOnChange = (value: NetworkId): void => {
    if (value === 'custom') {
      return openNetworkModal();
    }
    setSelectedNetwork(value);
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
              <Link href={getHref(pathname, item.href as string)}>
                {item.title}
              </Link>
            </NavHeaderLink>
          ))}
        </NavHeaderLinkList>
        <div className={rightSideMenu}>
          <NavHeaderButton
            aria-label="Toggle theme"
            onPress={() => toggleTheme()}
            className={atoms({ marginInlineEnd: 'sm' })}
          >
            <MonoContrast
              className={atoms({
                color: 'text.base.default',
                fontSize: 'lg',
              })}
            />
          </NavHeaderButton>
          <NavHeaderButton
            aria-label={'Application Settings'}
            onPress={() => handleDevOptionsClick()}
            className={atoms({
              marginInlineEnd: 'sm',
            })}
          >
            <MonoBuildCircle
              className={atoms({
                color: 'text.base.default',
                fontSize: 'lg',
              })}
            />
          </NavHeaderButton>
          <NavHeaderSelect
            id="network-select"
            aria-label={t('Select Network')}
            selectedKey={selectedNetwork as string}
            onSelectionChange={(value) => handleOnChange(value as NetworkIds)}
            startVisual={<MonoPublic />}
          >
            {[
              ...networksData.map((network: INetworkData) => (
                <SelectItem
                  key={network.networkId}
                  textValue={network.networkId}
                >
                  {network.label}
                </SelectItem>
              )),
              <SelectItem key="custom" textValue="custom">
                {t('+ add network')}
              </SelectItem>,
            ]}
          </NavHeaderSelect>
        </div>
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
