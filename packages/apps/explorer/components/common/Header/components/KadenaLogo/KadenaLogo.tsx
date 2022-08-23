import React, { FC, memo } from 'react';

const KadenaLogo: FC<{ id: string; width: number; height: number }> = ({
  id,
  width,
  height,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M43.8261 70.956H64L34.087 26.4343L22.2609 38.2604L43.8261 70.956Z"
        fill={`url(#paint0_linear_1873_202_${id})`}
      />
      <path
        d="M62.6087 0H41.7392L17.3914 25.7391V46.6087L62.6087 0Z"
        fill={`url(#paint1_linear_1873_202_${id})`}
      />
      <path d="M17.3913 0H0V70.9565H17.3913V0Z" fill="#F6CC62" />
      <defs>
        <linearGradient
          id={`paint0_linear_1873_202_${id}`}
          x1="37"
          y1="49"
          x2="17"
          y2="21"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6C65B" />
          <stop offset="1" stopColor="#AD0000" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_1873_202_${id}`}
          x1="30.6087"
          y1="7.65217"
          x2="-3.47819"
          y2="45.2173"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6C258" />
          <stop offset="0.773171" stopColor="#8E0F24" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default memo(KadenaLogo);
