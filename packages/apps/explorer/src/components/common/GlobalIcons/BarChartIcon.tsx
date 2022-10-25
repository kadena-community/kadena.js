import { IProps } from './ArrowIcon';

import React, { FC, memo } from 'react';

const BarChartIcon: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
        fill={fill}
      />
    </svg>
  );
};

export default memo(BarChartIcon);
