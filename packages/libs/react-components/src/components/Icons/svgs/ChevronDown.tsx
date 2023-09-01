import * as React from 'react';
import { type SVGProps } from 'react';

const ChevronDown: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M7.41 8.58L12 13.17L16.59 8.58L18 10L12 16L6 10L7.41 8.58Z"
    />
  </svg>
);

export { ChevronDown };
