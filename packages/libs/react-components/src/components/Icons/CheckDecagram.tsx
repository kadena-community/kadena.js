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
      d="M22 11L19.56 8.22L19.9 4.54L16.29 3.72L14.4 0.54L11 2L7.6 0.54L5.71 3.72L2.1 4.53L2.44 8.21L0 11L2.44 13.78L2.1 17.47L5.71 18.29L7.6 21.47L11 20L14.4 21.46L16.29 18.28L19.9 17.46L19.56 13.78L22 11ZM9 16L5 12L6.41 10.59L9 13.17L15.59 6.58L17 8L9 16Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
