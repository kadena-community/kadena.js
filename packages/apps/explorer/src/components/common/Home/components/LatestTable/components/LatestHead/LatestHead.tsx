import FeeEstimatorContainer from '../FeeEstimatorContainer/FeeEstimatorContainer';

import s from './LatestHead.module.css';

import React, { FC, memo, useContext } from 'react';
import { NetworkContext } from 'services/app';
import { NetworkName } from 'utils/api';

interface IProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const LatestHead: FC<IProps> = ({ activeTab, setActiveTab }) => {
  const { network } = useContext(NetworkContext);
  return (
    <div className={s.headContainer}>
      <div className={s.container}>
        <span
          className={`${s.block} ${
            activeTab === 'block' ? s.activeBlock : null
          }`}
          onClick={() => setActiveTab('block')}
        >
          Latest Blocks
        </span>
        {network === NetworkName.TEST_NETWORK ? null : (
          <span
            className={`${s.block} ${
              activeTab === 'transaction' ? s.activeBlock : null
            }`}
            onClick={() => setActiveTab('transaction')}
          >
            Latest Transactions
          </span>
        )}
      </div>
      <FeeEstimatorContainer network={network} />
    </div>
  );
};

export default memo(LatestHead);
