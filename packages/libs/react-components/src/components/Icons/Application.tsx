import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={22}
    height={20}
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H20C21.1 20 22 19.1 22 18V2C22 0.9 21.1 0 20 0ZM20 5H2V2H20V5Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
