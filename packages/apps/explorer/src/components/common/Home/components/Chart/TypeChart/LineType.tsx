import { BrushStartEndIndex } from '../Chart';
import CustomTooltip from '../CustomTooltip/CustomTooltip';

import React, { FC, memo, useState } from 'react';
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';
import { IDataChart } from 'services/banner';

interface IProps {
  chart: {
    data: IDataChart[];
    refAreaLeft: string;
    refAreaRight: string;
  };
  setChart: (chart: {
    data: IDataChart[];
    refAreaLeft: string;
    refAreaRight: string;
  }) => void;
  domain?: number[] | undefined;
  width: number;
  zoom: () => void;
  isRealTime: boolean;
}

const LineType: FC<IProps> = ({
  chart,
  setChart,
  domain,
  width,
  zoom,
  isRealTime,
}) => {
  const [position, setPosition] = useState<BrushStartEndIndex>({
    startIndex: 0,
    endIndex: 4,
  });

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <AreaChart
        data={chart.data}
        margin={{ top: 10, bottom: 10 }}
        onMouseDown={(e: CategoricalChartState) =>
          !isRealTime &&
          setChart({ ...chart, refAreaLeft: e?.activeLabel || '' })
        }
        onMouseMove={(e: CategoricalChartState) =>
          chart.refAreaLeft &&
          !isRealTime &&
          setChart({ ...chart, refAreaRight: e?.activeLabel || '' })
        }
        onMouseUp={() => !isRealTime && zoom()}
      >
        <defs>
          <linearGradient id="FillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(243.7, 198.2,  95.3, 0.254)" />
            <stop offset="79.18%" stopColor="rgba(233, 172, 83, 0)" />
          </linearGradient>
          <linearGradient id="StrokeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6CC62" />
            <stop offset="100%" stopColor="rgba(233, 172, 83, 0.3)" />
          </linearGradient>
        </defs>
        <CartesianGrid
          horizontal={false}
          strokeDasharray={3}
          stroke="#975E9A"
        />
        <XAxis
          dataKey="name"
          strokeWidth={0}
          stroke="#975E9A"
          style={{
            fontSize: '10px',
            fontFamily: 'Neue Haas Grotesk Display Pro',
            fontStyle: 'normal',
            fontWeight: 'normal',
          }}
        />
        <YAxis
          tick={{ dx: width > 860 ? -16 : 0 }}
          yAxisId="left"
          strokeWidth={0}
          domain={domain}
          stroke="#975E9A"
          style={{
            fontSize: '10px',
            fontFamily: 'Neue Haas Grotesk Display Pro',
            fontStyle: 'normal',
            fontWeight: 'normal',
          }}
        />
        {width > 860 ? (
          <YAxis
            tick={{ dx: 16 }}
            yAxisId="right"
            strokeWidth={0}
            domain={domain}
            stroke="#975E9A"
            orientation="right"
            style={{
              fontSize: '10px',
              fontFamily: 'Neue Haas Grotesk Display Pro',
              fontStyle: 'normal',
              fontWeight: 'normal',
            }}
          />
        ) : null}
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="url(#StrokeGradient)"
          strokeWidth="1"
          fillOpacity="1"
          fill="url(#FillGradient)"
          yAxisId="left"
        />
        {chart.refAreaLeft && chart.refAreaRight ? (
          <ReferenceArea
            yAxisId="left"
            x1={chart.refAreaLeft}
            x2={chart.refAreaRight}
            fill="#975e9a"
            fillOpacity="0.2"
          />
        ) : null}
        {!isRealTime && chart.data.length > 4 && width <= 700 && (
          <Brush
            dataKey="nameIndex"
            height={30}
            fill="rgb(0 0 0 / 50%)"
            stroke="#975e9a"
            startIndex={position.startIndex}
            endIndex={position.endIndex}
            tickFormatter={() => ''}
            gap={2}
            travellerWidth={8}
            onChange={(newIndex: any) => {
              const { startIndex, endIndex } = newIndex as BrushStartEndIndex;
              setPosition({ startIndex, endIndex });
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default memo(LineType);
