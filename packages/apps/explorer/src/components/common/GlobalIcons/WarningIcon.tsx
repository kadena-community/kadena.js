import { IProps } from './ArrowIcon';

import React, { FC, memo } from 'react';

const WarningIcon: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
    >
      <circle cx="12" cy="19" r="2" fill={fill} />
      <path d="M10 3h4v12h-4z" fill={fill} />
    </svg>
  );
};

export default memo(WarningIcon);
