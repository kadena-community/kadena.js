import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={24}
    height={14}
    viewBox="0 0 24 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21 13H15V10H13.3C12.2 12.4 9.7 14 7 14C3.1 14 0 10.9 0 7C0 3.1 3.1 0 7 0C9.7 0 12.2 1.6 13.3 4H24V10H21V13ZM17 11H19V8H22V6H11.9L11.7 5.3C11 3.3 9.1 2 7 2C4.2 2 2 4.2 2 7C2 9.8 4.2 12 7 12C9.1 12 11 10.7 11.7 8.7L11.9 8H17V11ZM7 10C5.3 10 4 8.7 4 7C4 5.3 5.3 4 7 4C8.7 4 10 5.3 10 7C10 8.7 8.7 10 7 10ZM7 6C6.4 6 6 6.4 6 7C6 7.6 6.4 8 7 8C7.6 8 8 7.6 8 7C8 6.4 7.6 6 7 6Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
