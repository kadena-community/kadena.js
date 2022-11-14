import { Loader } from '../../../Loader/Loader';

import FeeEstimatorContainer from './components/FeeEstimatorContainer/FeeEstimatorContainer';
import LatestHead from './components/LatestHead/LatestHead';
import s from './LatestTable.module.css';

import dynamic from 'next/dynamic';
import React, { ComponentType, FC, memo } from 'react';
import { useRecentInfo } from 'services/api';
import { useTableList } from 'services/latestTable';
import { NetworkName } from 'utils';

interface IProps {
  network: NetworkName;
}

const DynamicGraph: ComponentType<any> = dynamic(
  () => import('components/common/Home/components/Graph/Graph'),
  {
    ssr: false,
  },
);

const LatestTable: FC<IProps> = ({ network }) => {
  const recentInfo = useRecentInfo(network);
  const {
    isVisible,
    activeTab,
    setActiveTab,
    componentInfo,
    dataTableBlocks,
    dataTableTransactions,
  } = useTableList(recentInfo);

  if (!isVisible) {
    return null;
  }
  const { Component, props: componentProps } = componentInfo;
  return (
    <>
      <DynamicGraph />
      <FeeEstimatorContainer network={network} variant="mobile" />
      <div className={s.tableListRoot}>
        <div className={s.tableListContainer}>
          <LatestHead activeTab={activeTab} setActiveTab={setActiveTab} />
          {(activeTab === 'block' && dataTableBlocks.length === 0) ||
          (activeTab === 'transaction' &&
            dataTableTransactions.length === 0) ? (
            <Loader size={48} />
          ) : Component ? (
            <Component {...componentProps} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default memo(LatestTable);
