import { IProps } from './ArrowIcon';

import React, { FC, memo } from 'react';

const FileDownloadIcon: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill={fill} />
    </svg>
  );
};

export default memo(FileDownloadIcon);
