import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={8}
    height={12}
    viewBox="0 0 8 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0.589996 10.58L5.17 6L0.589996 1.41L2 0L8 6L2 12L0.589996 10.58Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
