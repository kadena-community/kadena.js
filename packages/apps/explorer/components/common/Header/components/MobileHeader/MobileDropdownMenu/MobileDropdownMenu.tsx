import React, { memo, useCallback, useContext, useState } from 'react';
import Link from 'next/link';
import { ActiveTab } from 'services/coin';
import WarningIcon from 'components/common/GlobalIcons/WarningIcon';
import s from './MobileDropdownMenu.module.css';
import GlobalDropdown from '../../../../GlobalDropdown/GlobalDropdown';
import { Route } from '../../../../../../config/Routes';
import { NetworkContext } from '../../../../../../services/app';
import { NetworkName } from '../../../../../../utils/api';
import GetStarted from '../../Menu/components/GetStarted/GetStarted';
import LearnMore from '../../Menu/components/LearnMore/LearnMore';
import Network from '../../Menu/components/Network/Network';
import ArrowIcon from '../../../../GlobalIcons/ArrowIcon';

const MobileDropdownMenu = () => {
  const { network, setNetwork } = useContext(NetworkContext);
  const [visible, setVisible] = useState<boolean | string>(false);
  const [visibleItem, setVisibleItem] = useState<boolean | string>('');
  const [subMenu, setSubMenu] = useState<boolean>(false);

  const onMenuItem = useCallback(item => {
    setVisibleItem(prev => (prev === item ? '' : item));
  }, []);

  const isUnfinishedChains =
    typeof window !== 'undefined' && !!localStorage.getItem('unfinishedChains');

  return (
    <div className={s.container}>
      <div
        className={s.icon}
        onClick={e => {
          e.stopPropagation();
          setVisible(!visible);
        }}>
        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 2V0H0V2H20ZM20 6V8H0V6H20ZM20 12V14H0V12H20Z"
            fill="white"
          />
        </svg>
      </div>
      {visible ? (
        <GlobalDropdown setOpenedTab={setVisible}>
          <div className={s.dropdownMenu}>
            <div
              className={s.item}
              onClick={e => {
                onMenuItem('about');
                e.stopPropagation();
              }}>
              {'ABOUT'}
              <ArrowIcon width={'8px'} height={'8px'} fill={'#120D23'} />
              {visibleItem === 'about' ? (
                <GlobalDropdown setOpenedTab={setVisibleItem}>
                  <div className={s.dropdownMenuItem}>
                    <Link href={Route.About}>
                      <a
                        href={Route.About}
                        className={`${s.menuItem} ${s.item}`}>
                        About Us
                      </a>
                    </Link>
                    <Link href="https://kadena.io/about/">
                      <a
                        target="_blank"
                        href="https://kadena.io/about/"
                        className={`${s.menuItem} ${s.item}`}>
                        Kadena
                      </a>
                    </Link>
                  </div>
                </GlobalDropdown>
              ) : null}
            </div>
            <div
              className={`${s.item} ${s.subMenuFinish}`}
              onClick={e => {
                onMenuItem('tools');
                e.stopPropagation();
              }}>
              {'TOOLS'}
              <ArrowIcon width={'8px'} height={'8px'} fill={'#120D23'} />
              {isUnfinishedChains && (
                <span className={s.iconWarning}>
                  <WarningIcon height="24" width="24" fill="#D61C06" />
                </span>
              )}
              {visibleItem === 'tools' ? (
                <GlobalDropdown setOpenedTab={setVisibleItem}>
                  <div className={s.dropdownMenuItem}>
                    <Link href={Route.Command}>
                      <a
                        target="_blank"
                        href={Route.Command}
                        className={`${s.menuItem} ${s.item}`}>
                        Command
                      </a>
                    </Link>
                    <div
                      className={`${s.item} ${s.itemCoin} ${s.subMenuFinish}`}
                      onClick={e => {
                        setSubMenu(!subMenu);
                        e.stopPropagation();
                      }}>
                      {'COIN'}
                      <ArrowIcon
                        width={'8px'}
                        height={'8px'}
                        fill={'#120D23'}
                      />
                      {isUnfinishedChains && (
                        <span className={s.iconWarning}>
                          <WarningIcon height="24" width="24" fill="#D61C06" />
                        </span>
                      )}
                      {subMenu ? (
                        <GlobalDropdown setOpenedTab={setVisibleItem}>
                          <div className={`${s.dropdownMenuItem} ${s.subMenu}`}>
                            <Link
                              href={{
                                pathname: Route.CoinParam,
                                query: { tab: ActiveTab.transfer },
                              }}>
                              <a
                                target="_blank"
                                className={`${s.menuItem} ${s.item}`}>
                                Transfer
                              </a>
                            </Link>
                            <Link
                              href={{
                                pathname: Route.CoinParam,
                                query: { tab: ActiveTab.finish },
                              }}>
                              <a
                                target="_blank"
                                className={`${s.menuItem} ${s.item} ${s.subMenuFinish}`}>
                                Finish Cross Chain Transfer
                                {isUnfinishedChains && (
                                  <span className={s.iconWarning}>
                                    <WarningIcon
                                      height="24"
                                      width="24"
                                      fill="#D61C06"
                                    />
                                  </span>
                                )}
                              </a>
                            </Link>
                            <Link
                              href={{
                                pathname: Route.CoinParam,
                                query: { tab: ActiveTab.balance },
                              }}>
                              <a
                                target="_blank"
                                className={`${s.menuItem} ${s.item}`}>
                                Check Account Balance
                              </a>
                            </Link>
                            <Link
                              href={{
                                pathname: Route.CoinParam,
                                query: { tab: ActiveTab.generate },
                              }}>
                              <a
                                target="_blank"
                                className={`${s.menuItem} ${s.item}`}>
                                Generate KeyPair
                              </a>
                            </Link>
                          </div>
                        </GlobalDropdown>
                      ) : null}
                    </div>
                  </div>
                </GlobalDropdown>
              ) : null}
            </div>
            <div
              className={s.item}
              onClick={e => {
                onMenuItem('started');
                e.stopPropagation();
              }}>
              {'GET STARTED'}
              <ArrowIcon width={'8px'} height={'8px'} fill={'#120D23'} />
              {visibleItem === 'started' ? (
                <GlobalDropdown setOpenedTab={setVisibleItem}>
                  <GetStarted mobileMenu="mobileMenu" />
                </GlobalDropdown>
              ) : null}
            </div>
            <div
              className={s.item}
              onClick={e => {
                onMenuItem('learn');
                e.stopPropagation();
              }}>
              {'LEARN MORE'}
              <ArrowIcon width={'8px'} height={'8px'} fill={'#120D23'} />
              {visibleItem === 'learn' ? (
                <GlobalDropdown setOpenedTab={setVisibleItem}>
                  <LearnMore mobileMenu="mobileMenu" />
                </GlobalDropdown>
              ) : null}
            </div>
            <div
              className={s.item}
              onClick={e => {
                onMenuItem(NetworkName.MAIN_NETWORK);
                e.stopPropagation();
              }}>
              {network}
              <ArrowIcon width={'8px'} height={'8px'} fill={'#120D23'} />
              {visibleItem === NetworkName.MAIN_NETWORK ? (
                <GlobalDropdown setOpenedTab={setVisibleItem}>
                  <Network setNetwork={setNetwork} mobileMenu="mobileMenu" />
                </GlobalDropdown>
              ) : null}
            </div>
          </div>
        </GlobalDropdown>
      ) : null}
    </div>
  );
};

export default memo(MobileDropdownMenu);
