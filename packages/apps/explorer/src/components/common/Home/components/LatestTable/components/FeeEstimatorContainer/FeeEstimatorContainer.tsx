import FeeEstimator from './FeeEstimator';
import s from './FeeEstimator.module.css';

import React, { FC, memo, useMemo } from 'react';
import { useRecentInfo } from 'services/api';
import { NetworkName } from 'utils/api';

interface IProps {
  network: NetworkName;
  variant?: 'default' | 'mobile';
}

const FeeEstimatorContainer: FC<IProps> = ({
  network,
  variant = 'default',
}) => {
  const { recentTransactions } = useRecentInfo(network);
  const requestKey = useMemo(() => {
    return recentTransactions?.length ? recentTransactions[0]?.requestKey : '';
  }, [recentTransactions]);

  return (
    <div
      className={`${s.container} ${
        variant === 'default' ? s.containerDefault : s.mobileContainer
      }`}
    >
      <div
        className={`${s.title} ${variant === 'mobile' ? s.mobileTitle : null}`}
      >
        Fee estimator
      </div>
      <FeeEstimator requestKey={requestKey} />
    </div>
  );
};

export default memo(FeeEstimatorContainer);
