import * as React from 'react';
import type { SVGProps } from 'react';
const SvgNavBackground = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={256}
    height={64}
    fill="none"
    {...props}
  >
    <g filter="url(#nav-background_svg__a)">
      <path
        fill="url(#nav-background_svg__b)"
        d="M138.243 17.77c78.302 3.31 82.667-29.799 43.925-47.346-38.741-17.547-95.762-10.926-122.227 4.966-26.464 15.892 0 39.068 78.302 42.38Z"
      />
    </g>
    <defs>
      <linearGradient
        id="nav-background_svg__b"
        x1={50}
        x2={197.045}
        y1={-40}
        y2={35.532}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ED098F" />
        <stop offset={1} stopColor="#2997FF" />
      </linearGradient>
      <filter
        id="nav-background_svg__a"
        width={256}
        height={158}
        x={0}
        y={-90}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_673_923"
          stdDeviation={25}
        />
      </filter>
    </defs>
  </svg>
);
export default SvgNavBackground;
