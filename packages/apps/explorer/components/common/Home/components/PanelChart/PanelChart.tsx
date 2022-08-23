import BarChartIcon from 'components/common/GlobalIcons/BarChartIcon';
import LineChartIcon from 'components/common/GlobalIcons/LineChartIcon';
import ZoomOut from 'components/common/GlobalIcons/ZoomOut';
import React, { memo } from 'react';
import { IDataChart } from 'services/banner';
import { TypeChart } from '../Chart/Chart';
import ExportChart from './ExportChart/ExportChart';
import s from './PanelChart.module.css';

interface Props {
  chartData: {
    domain?: number[];
    data: IDataChart[];
  };
  title: string;
  isRealTime: boolean;
  typeChart: TypeChart;
  setTypeChart: (typeChart: TypeChart) => void;
  zoomOut: () => void;
}

const PanelChart = ({
  chartData,
  title,
  isRealTime,
  typeChart,
  setTypeChart,
  zoomOut,
}: Props) => {
  return (
    <div className={s.containerRight}>
      <div className={s.containerChart}>
        <div
          onClick={() => setTypeChart(TypeChart.Bar)}
          className={`${s.iconChart} ${s.iconChartLeft} ${
            typeChart === TypeChart.Bar && s.iconChartActive
          }`}>
          <BarChartIcon height="24" width="24" fill="#8e6c93" />
        </div>
        <div
          onClick={() => setTypeChart(TypeChart.Line)}
          className={`${s.iconChart} ${s.iconChartRight} ${
            typeChart === TypeChart.Line && s.iconChartActive
          }`}>
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
};

export default memo(PanelChart);
