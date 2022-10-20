import BarChartIcon from 'components/common/GlobalIcons/BarChartIcon';
import LineChartIcon from 'components/common/GlobalIcons/LineChartIcon';
import ZoomOut from 'components/common/GlobalIcons/ZoomOut';
import React, { memo } from 'react';
import { IDataChart } from 'services/banner';
import { ChartType } from '../Chart/Chart';
import ExportChart from './ExportChart/ExportChart';

import s from './PanelChart.module.css';

interface Props {
  chartData: {
    domain?: number[];
    data: IDataChart[];
  };
  title: string;
  isRealTime: boolean;
  chartType: ChartType;
  setTypeChart: (chartType: ChartType) => void;
  zoomOut: () => void;
}

const PanelChart = ({
  chartData,
  title,
  isRealTime,
  chartType,
  setTypeChart,
  zoomOut,
}: Props) => (
  <div className={s.containerRight}>
    <div className={s.containerChart}>
      <div
        onClick={() => setTypeChart(ChartType.Bar)}
        className={`${s.iconChart} ${s.iconChartLeft} ${
          chartType === ChartType.Bar && s.iconChartActive
        }`}
      >
        <BarChartIcon height="24" width="24" fill="#8e6c93" />
      </div>
      <div
        onClick={() => setTypeChart(ChartType.Line)}
        className={`${s.iconChart} ${s.iconChartRight} ${
          chartType === ChartType.Line && s.iconChartActive
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
