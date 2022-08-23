import React, { FC, memo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ActiveTab } from 'services/coin';
import WarningIcon from 'components/common/GlobalIcons/WarningIcon';
import s from './MenuTools.module.css';
import Command from './Icons/Command';
import Coin from './Icons/Coin';
import { Route } from '../../../../../../../config/Routes';

const MenuTools: FC = () => {
  const router = useRouter();
  const isUnfinishedChains =
    typeof window !== 'undefined' && !!localStorage.getItem('unfinishedChains');
  return (
    <div className={s.toolsContainer}>
      <div className={s.command}>
        <Command router={router} />
        <Link href={Route.Command}>
          <a target="_blank" className={s.head} href={Route.Command}>
            Command Preview
          </a>
        </Link>
      </div>
      <div className={s.coin}>
        <Coin router={router} />
        <Link href={Route.Coin}>
          <a target="_blank" className={s.head} href={Route.Coin}>
            Coin Transfer
            {isUnfinishedChains && (
              <WarningIcon height="24" width="24" fill="#D61C06" />
            )}
          </a>
        </Link>
        <div className={s.submenuContainer}>
          <div>
            <Link
              href={{
                pathname: Route.CoinParam,
                query: { tab: ActiveTab.transfer },
              }}>
              <a target="_blank" className={s.submenu}>
                Transfer
              </a>
            </Link>
            <Link
              href={{
                pathname: Route.CoinParam,
                query: { tab: ActiveTab.finish },
              }}>
              <a target="_blank" className={`${s.submenu} ${s.submenuFinish}`}>
                Finish Cross Chain Transfer
                {isUnfinishedChains && (
                  <WarningIcon height="24" width="24" fill="#D61C06" />
                )}
              </a>
            </Link>
            <Link
              href={{
                pathname: Route.CoinParam,
                query: { tab: ActiveTab.balance },
              }}>
              <a target="_blank" className={s.submenu}>
                Check Account Balance
              </a>
            </Link>
            <Link
              href={{
                pathname: Route.CoinParam,
                query: { tab: ActiveTab.generate },
              }}>
              <a target="_blank" className={s.submenu}>
                Generate KeyPair
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MenuTools);
