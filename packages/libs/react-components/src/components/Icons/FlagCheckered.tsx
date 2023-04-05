import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={15}
    height={17}
    viewBox="0 0 15 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.4 2H15V12H8L7.6 10H2V17H0V0H9L9.4 2ZM9 10H11V8H13V6H11V4H9V6L8 4V2H6V4H4V2H2V4H4V6H2V8H4V6H6V8H8V6L9 8V10ZM6 6V4H8V6H6ZM9 6H11V8H9V6Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
