import type { SVGProps } from 'react';
import * as React from 'react';

const FlagCheckered: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="currentColor"
      d="M14.4 6H20V16H13L12.6 14H7V21H5V4H14L14.4 6ZM14 14H16V12H18V10H16V8H14V10L13 8V6H11V8H9V6H7V8H9V10H7V12H9V10H11V12H13V10L14 12V14ZM11 10V8H13V10H11ZM14 10H16V12H14V10Z"
    />
  </svg>
);

export { FlagCheckered };
