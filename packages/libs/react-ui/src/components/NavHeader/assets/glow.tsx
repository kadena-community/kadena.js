import type { SVGProps } from 'react';
import * as React from 'react';

export const NavGlow: React.FC<SVGProps<SVGSVGElement>> = () => (
  <svg
    width="256"
    height="64"
    viewBox="0 0 256 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_673_923)">
      <path
        d="M138.243 17.7691C216.545 21.08 220.91 -12.0285 182.168 -29.576C143.427 -47.1235 86.4056 -40.5018 59.9412 -24.6097C33.4769 -8.71766 59.9412 14.4583 138.243 17.7691Z"
        fill="url(#paint0_linear_673_923)"
      ></path>
    </g>
    <defs>
      <filter
        id="filter0_f_673_923"
        x="0"
        y="-90"
        width="256"
        height="158"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="25"
          result="effect1_foregroundBlur_673_923"
        ></feGaussianBlur>
      </filter>
      <linearGradient
        id="paint0_linear_673_923"
        x1="50"
        y1="-40"
        x2="197.045"
        y2="35.5324"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ED098F"></stop>
        <stop offset="1" stopColor="#2997FF"></stop>
      </linearGradient>
    </defs>
  </svg>
);
