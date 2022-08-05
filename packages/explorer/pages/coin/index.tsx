import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Layout from '../../components/common/Layout/Layout';
import CoinTabBar from '../../components/common/Coin/components/CoinTabBar/CoinTabBar';
import { useCoin } from '../../services/coin';
import s from '../../components/common/Coin/Coin.module.css';

const CoinTransferComponent = () => {
  const { activeTab, componentInfo } = useCoin();
  const { Component, props } = componentInfo;

  return (
    <Layout>
      <div className={s.coinContainer}>
        <p className={s.coinHeader}>Coin Transfer</p>
        <div className={s.coinBlocks}>
          <div className={s.blocks}>
            <CoinTabBar activeTab={activeTab} />
            <Component {...props} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const CoinTransferDynamic: any = dynamic<any>(
  // @ts-ignore
  () => Promise.resolve(CoinTransferComponent),
  {
    ssr: false,
  },
);

const CoinTransfer: NextPage = () => {
  return <CoinTransferDynamic />;
};

export default CoinTransfer;
