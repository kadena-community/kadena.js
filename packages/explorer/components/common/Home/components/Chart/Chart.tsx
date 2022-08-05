import React, { FC, memo, useEffect, useState } from 'react';
import { IDataChart } from 'services/banner';
import { TimeInterval } from 'utils/api';
import s from './Chart.module.css';
import { useWindowSize } from '../../../../../utils/window';
import PanelChart from '../PanelChart/PanelChart';
import LineType from './TypeChart/LineType';
import BarType from './TypeChart/BarType';

interface IProps {
  chartData: {
    domain?: number[];
    data: IDataChart[];
  };
  title: string;
  isRealTime: boolean;
  timeInterval: TimeInterval;
  active: number;
}

export enum TypeChart {
  Line = 'line',
  Bar = 'bar',
}

export interface BrushStartEndIndex {
  startIndex?: number;
  endIndex?: number;
}

const Chart: FC<IProps> = ({
  chartData,
  title,
  isRealTime,
  timeInterval,
  active,
}) => {
  const [typeChart, setTypeChart] = useState<TypeChart>(TypeChart.Line);
  const [width] = useWindowSize();

  const [stateTime, setStateTime] = useState<TimeInterval>(timeInterval);
  const [stateActive, setStateActive] = useState<number>(active);

  const [chart, setChart] = useState({
    data: chartData.data,
    refAreaLeft: '',
    refAreaRight: '',
  });

  useEffect(() => {
    if (isRealTime || stateTime !== timeInterval || active !== stateActive) {
      setChart({ ...chart, data: chartData.data });
      setStateTime(timeInterval);
      setStateActive(active);
    }
  }, [chartData.data]);

  const zoomOut = () => {
    setChart({
      data: chartData.data,
      refAreaLeft: '',
      refAreaRight: '',
    });
  };

  const zoom = () => {
    const { data, refAreaLeft, refAreaRight } = chart;
    if (
      refAreaLeft === refAreaRight ||
      refAreaRight === '' ||
      !refAreaRight ||
      !refAreaLeft
    ) {
      setChart({
        ...chart,
        refAreaLeft: '',
        refAreaRight: '',
      });
      return null;
    }

    let indexLeft = data.findIndex(item => item.name === refAreaLeft);
    let indexRight = data.findIndex(item => item.name === refAreaRight);

    if (indexLeft > indexRight) {
      [indexLeft, indexRight] = [indexRight, indexLeft];
    }

    setChart({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(indexLeft, indexRight + 1),
    });
  };

  return (
    <>
      <PanelChart
        chartData={chartData}
        title={title}
        isRealTime={isRealTime}
        typeChart={typeChart}
        setTypeChart={setTypeChart}
        zoomOut={zoomOut}
      />
      <div className={s.container}>
        <div className={s.chartsContainer}>
          {typeChart === TypeChart.Line ? (
            <LineType
              chart={chart}
              setChart={setChart}
              domain={chartData.domain}
              width={width}
              zoom={zoom}
              isRealTime={isRealTime}
            />
          ) : (
            <BarType
              chart={chart}
              setChart={setChart}
              domain={chartData.domain}
              width={width}
              zoom={zoom}
              isRealTime={isRealTime}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Chart);
