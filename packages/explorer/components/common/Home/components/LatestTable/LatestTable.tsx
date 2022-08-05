import React, { FC, memo } from 'react';
import dynamic from 'next/dynamic';
import LatestHead from './components/LatestHead/LatestHead';
import { useTableList } from '../../../../../services/latestTable';
import s from './LatestTable.module.css';
import { NetworkName } from '../../../../../utils/api';
import { Loader } from '../../../Loader/Loader';
import { useRecentInfo } from '../../../../../services/api';
import FeeEstimatorContainer from './components/FeeEstimatorContainer/FeeEstimatorContainer';

interface Props {
  network: NetworkName;
}

const DynamicGraph = dynamic(
  () => import('components/common/Home/components/Graph/Graph'),
  {
    ssr: false,
  },
);

const LatestTable: FC<Props> = ({ network }) => {
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
