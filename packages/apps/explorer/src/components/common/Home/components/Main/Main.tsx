import { Loader } from '../../../Loader/Loader';
import Banner from '../Banner/Banner';
import Chart from '../Chart/Chart';
import CoinInformation from '../CoinInformation/CoinInformation';

import s from './Main.module.css';

import React, { memo, useCallback, useMemo, useState } from 'react';
import { useAllInfoByTime, useChainInfo } from 'services/api';
import { useChartData } from 'services/banner';
import { NetworkName, TimeInterval } from 'utils/api';

interface IProps {
  network: NetworkName;
  nodeInfo: any;
}

const Main = ({ network, nodeInfo }: IProps) => {
  const chainInfo = useChainInfo(network, nodeInfo);

  const [timeInterval, setTimeInterval] = useState<TimeInterval>(
    TimeInterval.REAL_TIME,
  );
  const onChangeTimeInterval = useCallback((current: TimeInterval) => {
    setTimeInterval(current);
  }, []);

  const { data: allInfo, isLoading } = useAllInfoByTime(network, {
    time: timeInterval,
  });

  const chartDataProps = useMemo(
    () => ({
      network,
      chainInfo,
      allInfo,
      timeInterval,
    }),
    [network, chainInfo, allInfo, timeInterval],
  );
  const { banners, onChangeBg, active, chartData } =
    useChartData(chartDataProps);

  const banner = useMemo(() => {
    return banners.find((item) => active === item.id);
  }, [banners, active]);

  return (
    <div className="mainChartContainer">
      {banners.length === 0 ? (
        <Loader size={64} />
      ) : (
        <>
          {(isLoading && chartData.data.length === allInfo.length) ||
          timeInterval === TimeInterval.REAL_TIME ? (
            <Chart
              chartData={chartData}
              title={banner?.title || ''}
              isRealTime={timeInterval === TimeInterval.REAL_TIME}
              timeInterval={timeInterval}
              active={active}
            />
          ) : (
            <div className={s.loaderContainer}>
              <Loader size={64} />
            </div>
          )}
          <Banner
            active={active}
            banners={banners}
            onChangeBg={onChangeBg}
            timeInterval={timeInterval}
            onChangeTimeInterval={onChangeTimeInterval}
          />
          <CoinInformation network={network} />
        </>
      )}
    </div>
  );
};

export default memo(Main);
