import * as React from 'react';
import type { SVGProps } from 'react';
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 64 64"
    {...props}
  >
    <g clipPath="url(#logo_svg__a)">
      <path
        fill="url(#logo_svg__b)"
        d="M50.484 10.607H37.936L23.167 26.105v12.912l27.317-28.41Z"
      />
      <path fill="#fff" d="M23.167 53.393H12.56V10.607h10.607v42.786Z" />
      <path
        fill="url(#logo_svg__c)"
        d="M51.44 53.393 34.01 27.742 26.91 35.12l12.212 18.273H51.44Z"
      />
    </g>
    <defs>
      <linearGradient
        id="logo_svg__b"
        x1={23.167}
        x2={50.484}
        y1={24.812}
        y2={24.812}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" stopOpacity={0} />
        <stop offset={0.6} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id="logo_svg__c"
        x1={27}
        x2={47.036}
        y1={41}
        y2={47.364}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" stopOpacity={0} />
        <stop offset={0.6} stopColor="#fff" />
      </linearGradient>
      <clipPath id="logo_svg__a">
        <path fill="#fff" d="M0 0h64v64H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgLogo;
