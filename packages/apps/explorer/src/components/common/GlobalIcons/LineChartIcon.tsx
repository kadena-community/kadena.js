import { IProps } from './ArrowIcon';

import React, { FC, memo } from 'react';

const LineChartIcon: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"
        fill={fill}
      />
    </svg>
  );
};

export default memo(LineChartIcon);
