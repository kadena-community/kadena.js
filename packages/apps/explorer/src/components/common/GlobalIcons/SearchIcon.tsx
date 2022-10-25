import { IProps } from './ArrowIcon';

import React, { FC, memo } from 'react';

const SearchIcon: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 11H11.71L11.43 10.73C12.63 9.33002 13.25 7.42002 12.91 5.39002C12.44 2.61002 10.12 0.390015 7.32 0.0500152C3.09 -0.469985 -0.47 3.09001 0.05 7.32001C0.39 10.12 2.61 12.44 5.39 12.91C7.42 13.25 9.33 12.63 10.73 11.43L11 11.71V12.5L15.25 16.75C15.66 17.16 16.33 17.16 16.74 16.75C17.15 16.34 17.15 15.67 16.74 15.26L12.5 11ZM6.5 11C4.01 11 2 8.99002 2 6.50002C2 4.01002 4.01 2.00002 6.5 2.00002C8.99 2.00002 11 4.01002 11 6.50002C11 8.99002 8.99 11 6.5 11Z"
        fill={fill}
      />
    </svg>
  );
};

export default memo(SearchIcon);
