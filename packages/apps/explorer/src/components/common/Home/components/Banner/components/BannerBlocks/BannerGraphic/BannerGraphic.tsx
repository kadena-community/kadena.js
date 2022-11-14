import s from './BannerGraphic.module.css';

import React, { FC, memo } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { IDataChartBlock } from 'services/banner';

interface IProps {
  blockChartData: IDataChartBlock[];
}

const BannerGraphic: FC<IProps> = ({ blockChartData }) => {
  return (
    <div className={s.bannerGraphicContainer}>
      <ResponsiveContainer height={'100%'} width={'100%'}>
        <AreaChart data={blockChartData}>
          <defs>
            <linearGradient id="GradientMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="-17.4%" stopColor="rgba(166, 127, 168, 0.31)" />
              <stop offset="79.18%" stopColor="rgba(166, 127,168, 0)" />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#88668F"
            strokeWidth="1"
            fillOpacity="1"
            fill="url(#GradientMobile)"
            yAxisId="left"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className={s.leftOpacity} />
      <div className={s.rightOpacity} />
    </div>
  );
};

export default memo(BannerGraphic);
