import React, { FC, memo } from 'react';

export interface IProps {
  height: string;
  width: string;
  fill: string;
}

const ArrowIcon: FC<IProps> = ({ height, width, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.836951 1.7825L2.77945 3.725C3.07195 4.0175 3.54445 4.0175 3.83695 3.725L5.77945 1.7825C6.25195 1.31 5.91445 0.5 5.24695 0.5H1.36195C0.694451 0.5 0.364451 1.31 0.836951 1.7825Z"
        fill={fill}
      />
    </svg>
  );
};

export default memo(ArrowIcon);
