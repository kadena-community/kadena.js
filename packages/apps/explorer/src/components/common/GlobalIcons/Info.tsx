import { IProps } from './ArrowIcon';

import React, { FC, memo } from 'react';

const Info: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 44 40"
    >
      <path
        d="M22.0003 5.4775L38.9428 34.75H5.05777L22.0003 5.4775ZM1.16527 32.5C-0.567227 35.4925 1.59277 39.25 5.05777 39.25H38.9428C42.4078 39.25 44.5678 35.4925 42.8353 32.5L25.8928 3.2275C24.1603 0.234999 19.8403 0.234999 18.1078 3.2275L1.16527 32.5ZM19.7503 16.75V21.25C19.7503 22.4875 20.7628 23.5 22.0003 23.5C23.2378 23.5 24.2503 22.4875 24.2503 21.25V16.75C24.2503 15.5125 23.2378 14.5 22.0003 14.5C20.7628 14.5 19.7503 15.5125 19.7503 16.75ZM19.7503 28H24.2503V32.5H19.7503V28Z"
        fill={fill}
      />
    </svg>
  );
};

export default memo(Info);
