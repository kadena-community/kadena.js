import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={18}
    height={14}
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 2L6 14L0.5 8.5L1.91 7.09L6 11.17L16.59 0.59L18 2Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
