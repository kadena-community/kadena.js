import * as React from 'react';
import { SVGProps } from 'react';

export const KadenaLogo: React.FC<SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <g clipPath="url(#clip0_3_15)">
      <path
        d="M31.5523 6.62952H23.7098L14.4796 16.3155V24.3859L31.5523 6.62952Z"
        fill="url(#paint0_linear_3_15)"
      />
      <path d="M14.4796 33.3705H7.8501V6.62952H14.4796V33.3705Z" fill="white" />
      <path
        d="M32.1499 33.3705L21.256 17.3386L16.8195 21.9499L24.4518 33.3705H32.1499Z"
        fill="url(#paint1_linear_3_15)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_3_15"
        x1="14.4796"
        y1="15.5077"
        x2="31.5523"
        y2="15.5077"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="0.6" stopColor="white" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3_15"
        x1="15.5989"
        y1="20.6432"
        x2="29.3973"
        y2="29.6024"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="0.6" stopColor="white" />
      </linearGradient>
      <clipPath id="clip0_3_15">
        <rect width="40" height="40" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
