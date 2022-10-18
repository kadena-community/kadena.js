import React, { FC, memo } from 'react';

const RightArrow: FC = () => {
  return (
    <svg
      width="32"
      height="29"
      viewBox="0 0 32 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1913 17.4583H0.708313V11.5417H20.1913L13.4081 4.75853L17.5918 0.574814L31.517 14.5L17.5918 28.4252L13.4081 24.2415L20.1913 17.4583Z"
        fill="#975E9A"
      />
    </svg>
  );
};

export default memo(RightArrow);
