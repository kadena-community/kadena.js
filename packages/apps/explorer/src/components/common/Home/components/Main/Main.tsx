import React, { memo, useCallback, useMemo, useState } from 'react';
import Chart from '../Chart/Chart';
import Banner from '../Banner/Banner';
import { useChartData } from 'services/banner';
import { useAllInfoByTime, useChainInfo } from 'services/api';
import { Loader } from '../../../Loader/Loader';
import { NetworkName, TimeInterval } from 'utils/api';
import s from './Main.module.css';
import CoinInformation from '../CoinInformation/CoinInformation';

interface Props {
  network: NetworkName;
  nodeInfo: any;
}

const Main = ({ network, nodeInfo }: Props) => {
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
    [network, chainInfo],
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
