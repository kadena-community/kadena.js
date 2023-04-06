import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 14C7.55 14 8 14.45 8 15C8 15.55 7.55 16 7 16C6.45 16 6 15.55 6 15C6 14.45 6.45 14 7 14ZM14.07 3.69L15.5 5.1L14.07 6.5L12.66 5.1L14.07 3.69ZM16.9 6.5L18.31 7.93L16.9 9.34L15.5 7.93L16.9 6.5ZM7 12C5.34 12 4 13.34 4 15C4 16.66 5.34 18 7 18C8.66 18 10 16.66 10 15C10 13.34 8.66 12 7 12ZM8.77 3.33L9.5 4.08L13.29 0.29C13.47 0.11 13.72 0 14 0C14.28 0 14.53 0.11 14.71 0.29L21.78 7.36V7.37C21.92 7.54 22 7.76 22 8C22 8.3 21.87 8.57 21.66 8.76L17.93 12.5L18.67 13.23L11.95 19.95C10.68 21.22 8.93 22 7 22C3.13 22 0 18.87 0 15C0 13.07 0.78 11.32 2.05 10.05L8.77 3.33ZM19.59 8L14 2.41L10.93 5.5L16.5 11.08L19.59 8Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
