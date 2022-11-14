import s from './CoinInformation.module.css';
import GasPrice from './GasPrice';

import React, { FC, memo, useMemo } from 'react';
import { useCoinInformation, useRecentInfo } from 'services/api';
import { NetworkName } from 'utils/api';

interface IProps {
  network: NetworkName;
}

const CoinInformation: FC<IProps> = ({ network }) => {
  const { data } = useCoinInformation(NetworkName.MAIN_NETWORK);

  const marketCap = useMemo(() => {
    return (
      !!data?.marketCap &&
      new Intl.NumberFormat('en-US').format(data?.marketCap)
    );
  }, [data?.marketCap]);

  const { recentTransactions } = useRecentInfo(network);
  const requestKey = useMemo(() => {
    return recentTransactions?.length ? recentTransactions[0]?.requestKey : '';
  }, [recentTransactions]);

  return (
    <div className={s.container}>
      <div>
        <div className={s.title}>KDA price</div>
        <div>
          <span className={s.text}>${data?.usd}</span>
          <span className={s.subtext1}> @&nbsp;{data?.btc}&nbsp;BTC</span>
          {data?.percentage > 0 ? (
            <span className={s.subtext2}> (+{data?.percentage}%)</span>
          ) : (
            <span className={s.subtext3}> ({data?.percentage}%)</span>
          )}
        </div>
      </div>
      <GasPrice requestKey={requestKey} />
      <div>
        <div className={s.title}>Market capital</div>
        <div className={s.text}>${marketCap}</div>
      </div>
    </div>
  );
};

export default memo(CoinInformation);
