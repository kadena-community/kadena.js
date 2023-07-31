import * as React from 'react';
import type { SVGProps } from 'react';
const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 8 12"
    {...props}
  >
    <path d="M7.41 10.58 2.83 6l4.58-4.59L6 0 0 6l6 6 1.41-1.42Z" />
  </svg>
);
export default SvgChevronLeft;
