import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 15.61L4.41 17L9.42 12L4.41 7L3 8.39L6.56 12L3 15.61ZM21 6H8V8H21V6ZM21 13V11H11V13H21ZM21 18V16H8V18H21Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
