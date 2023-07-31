import * as React from 'react';
import type { SVGProps } from 'react';
const SvgChain = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 10"
    {...props}
  >
    <path d="M1.9 5c0-1.71 1.39-3.1 3.1-3.1h4V0H5a5 5 0 1 0 0 10h4V8.1H5C3.29 8.1 1.9 6.71 1.9 5ZM6 6h8V4H6v2Zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V10h4a5 5 0 1 0 0-10Z" />
  </svg>
);
export default SvgChain;
