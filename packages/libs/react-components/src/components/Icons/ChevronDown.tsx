import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={12}
    height={8}
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.41 0.580002L6 5.17L10.59 0.580002L12 2L6 8L0 2L1.41 0.580002Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
