import * as React from 'react';
import type { SVGProps } from 'react';
const SvgKLogoComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 64 65"
    {...props}
  >
    <g clipPath="url(#k-logo-component_svg__a)">
      <rect
        width={64}
        height={64}
        y={0.5}
        fill="#000"
        fillOpacity={0.8}
        rx={8}
      />
      <path
        fill="#fff"
        d="M50.484 11.107H37.936L23.167 26.605v12.912l27.317-28.41Z"
      />
      <path
        fill="url(#k-logo-component_svg__b)"
        d="M50.484 11.107H37.936L23.167 26.605v12.912l27.317-28.41Z"
      />
      <path fill="#fff" d="M23.167 53.893H12.56V11.107h10.607v42.786Z" />
      <path
        fill="url(#k-logo-component_svg__c)"
        d="M51.44 53.893 34.01 28.242 26.91 35.62l12.212 18.273H51.44Z"
      />
    </g>
    <defs>
      <linearGradient
        id="k-logo-component_svg__b"
        x1={23.167}
        x2={50.484}
        y1={25.312}
        y2={25.312}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity={0.99} />
        <stop offset={0.471} stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="k-logo-component_svg__c"
        x1={27}
        x2={47.036}
        y1={41.5}
        y2={47.864}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" stopOpacity={0} />
        <stop offset={0.6} stopColor="#fff" />
      </linearGradient>
      <clipPath id="k-logo-component_svg__a">
        <rect width={64} height={64} y={0.5} fill="#fff" rx={8} />
      </clipPath>
    </defs>
  </svg>
);
export default SvgKLogoComponent;
