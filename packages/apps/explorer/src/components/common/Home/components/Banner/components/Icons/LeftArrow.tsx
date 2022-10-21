import React, { FC, memo } from 'react';

const LeftArrow: FC = () => {
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
        d="M11.8087 17.4583H31.2917V11.5417H11.8087L18.5919 4.75853L14.4082 0.574814L0.482973 14.5L14.4082 28.4252L18.5919 24.2415L11.8087 17.4583Z"
        fill="#975E9A"
      />
    </svg>
  );
};

export default memo(LeftArrow);
