import React from 'react';

interface BlockActivityChartProps {
  data: number[];
}

const BlockActivityChart: React.FC<BlockActivityChartProps> = ({ data }) => {
  const barWidth = 15;
  const gap = 4;
  const totalWidth = data.length * (barWidth + gap) * 2; // Calculate total width with padding
  const height = 50;
  const maxValue = Math.max(...data);
  const scaleFactor = maxValue !== 0 ? height / maxValue : 1;

  return (
    <svg width={totalWidth} height={height} xmlns="http://www.w3.org/2000/svg">
      {data.map((value, index) => {
        const barHeight = Math.max(value * scaleFactor, value === 0 ? 2 : 0);
        const x = index * (barWidth + gap);
        const y = height - barHeight;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill="black"
          />
        );
      })}
    </svg>
  );
};

export default BlockActivityChart;
