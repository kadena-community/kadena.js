import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={22}
    height={12}
    viewBox="0 0 22 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM11.6 4C10.8 1.7 8.6 0 6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C8.6 12 10.8 10.3 11.6 8H15V12H19V8H22V4H11.6Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
