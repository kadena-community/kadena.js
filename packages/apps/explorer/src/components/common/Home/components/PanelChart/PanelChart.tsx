import { IChartType } from '../Chart/Chart';

import ExportChart from './ExportChart/ExportChart';
import s from './PanelChart.module.css';

import BarChartIcon from 'components/common/GlobalIcons/BarChartIcon';
import LineChartIcon from 'components/common/GlobalIcons/LineChartIcon';
import ZoomOut from 'components/common/GlobalIcons/ZoomOut';
import React, { FC, memo } from 'react';
import { IDataChart } from 'services/banner';

interface IProps {
  chartData: {
    domain?: number[];
    data: IDataChart[];
  };
  title: string;
  isRealTime: boolean;
  chartType: IChartType;
  setTypeChart: (chartType: IChartType) => void;
  zoomOut: () => void;
}

const PanelChart: FC<IProps> = ({
  chartData,
  title,
  isRealTime,
  chartType,
  setTypeChart,
  zoomOut,
}) => (
  <div className={s.containerRight}>
    <div className={s.containerChart}>
      <div
        onClick={() => setTypeChart(IChartType.Bar)}
        className={`${s.iconChart} ${s.iconChartLeft} ${
          chartType === IChartType.Bar && s.iconChartActive
        }`}
      >
        <BarChartIcon height="24" width="24" fill="#8e6c93" />
      </div>
      <div
        onClick={() => setTypeChart(IChartType.Line)}
        className={`${s.iconChart} ${s.iconChartRight} ${
          chartType === IChartType.Line && s.iconChartActive
        }`}
      >
        <LineChartIcon height="24" width="24" fill="#8e6c93" />
      </div>
    </div>
    <div className={s.containerLeft}>
      {!isRealTime && (
        <div onClick={() => zoomOut()}>
          <ZoomOut height="24" width="24" fill="#8e6c93" />
        </div>
      )}
      <ExportChart
        chartData={chartData}
        title={title}
        isRealTime={isRealTime}
      />
    </div>
  </div>
);

export default memo(PanelChart);
