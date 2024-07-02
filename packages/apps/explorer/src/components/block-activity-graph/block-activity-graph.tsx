import { Stack } from '@kadena/react-ui';
import React, { useEffect, useState } from 'react';
import { barClass } from './style.css';

interface IData {
  height: number;
  data: number;
}

interface IBlockActivityChartProps {
  data: IData[];
}

const BlockActivityChart: React.FC<IBlockActivityChartProps> = ({ data }) => {
  const [innerData, setInnerData] = useState<IData[]>(
    data.map((o) => ({ ...o, data: 2 })),
  );
  const barWidth = 12;
  const height = 50;
  const maxValue = Math.max(...data.map((o) => o.data));
  const scaleFactor = maxValue !== 0 ? height / maxValue : 1;

  useEffect(() => {
    if (!data.length) return;

    setInnerData(
      data.map((o) => {
        return {
          ...o,
          data: Math.max(o.data * scaleFactor, o.data === 0 ? 2 : 0),
        };
      }),
    );
  }, [data]);
  return (
    <>
      <Stack
        position="relative"
        style={{ height, transform: 'translateX(-20px)' }}
      >
        {data.map((data, idx) => {
          const barHeight = innerData[idx].data;
          const x = idx * barWidth;
          const y = height - barHeight;

          return (
            <Stack
              className={barClass}
              key={data.height}
              style={{
                left: x,
                top: y,
                height: barHeight,
              }}
            ></Stack>
          );
        })}
      </Stack>
    </>
  );
};

export default BlockActivityChart;
