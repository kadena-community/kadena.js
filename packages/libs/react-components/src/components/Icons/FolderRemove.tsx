import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={21}
    height={19}
    viewBox="0 0 21 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11 15C11 15.34 11.04 15.67 11.09 16H2C0.9 16 0 15.11 0 14V2C0 0.89 0.89 0 2 0H8L10 2H18C19.1 2 20 2.89 20 4V9.81C19.39 9.46 18.72 9.22 18 9.09V4H2V14H11.09C11.04 14.33 11 14.66 11 15ZM20.54 12.88L19.12 11.47L17 13.59L14.88 11.47L13.47 12.88L15.59 15L13.47 17.12L14.88 18.54L17 16.41L19.12 18.54L20.54 17.12L18.41 15L20.54 12.88Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
