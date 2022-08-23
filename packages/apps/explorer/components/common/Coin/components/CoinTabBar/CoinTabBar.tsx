import React, { FC } from 'react';
import Link from 'next/link';
import { Route } from 'config/Routes';
import { ActiveTab } from 'services/coin';
import s from './CoinTabBar.module.css';
import { useWindowSize } from '../../../../../utils/window';

interface IProps {
  activeTab: string;
}

const CoinTabBar: FC<IProps> = ({ activeTab }) => {
  const [width] = useWindowSize();

  return (
    <div className={s.headContainer}>
      <Link
        href={{
          pathname: Route.CoinParam,
          query: { tab: ActiveTab.transfer },
        }}
        passHref>
        <span
          className={`${s.block} ${
            activeTab === ActiveTab.transfer ? s.activeBlock : null
          }`}>
          Transfer
        </span>
      </Link>
      <Link
        href={{
          pathname: Route.CoinParam,
          query: { tab: ActiveTab.finish },
        }}
        passHref>
        <span
          className={`${s.block} ${
            activeTab === ActiveTab.finish ? s.activeBlock : null
          }`}>
          {width < 1024 ? 'Finish Transfer' : 'Finish Cross Chain Transfer'}
        </span>
      </Link>
      <Link
        href={{
          pathname: Route.CoinParam,
          query: { tab: ActiveTab.balance },
        }}
        passHref>
        <span
          className={`${s.block} ${
            activeTab === ActiveTab.balance ? s.activeBlock : null
          }`}>
          {width < 1024 ? 'Check Balance' : 'Check Account Balance'}
        </span>
      </Link>
      <Link
        href={{
          pathname: Route.CoinParam,
          query: { tab: ActiveTab.generate },
        }}
        passHref>
        <span
          className={`${s.block} ${
            activeTab === ActiveTab.generate ? s.activeBlock : null
          }`}>
          Generate KeyPair
        </span>
      </Link>
    </div>
  );
};

export default CoinTabBar;
