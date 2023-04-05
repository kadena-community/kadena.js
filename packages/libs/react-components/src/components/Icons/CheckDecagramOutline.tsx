import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 11L19.6 8.2L19.9 4.5L16.3 3.7L14.4 0.5L11 2L7.6 0.5L5.7 3.7L2.1 4.5L2.4 8.2L0 11L2.4 13.8L2.1 17.5L5.7 18.3L7.6 21.5L11 20L14.4 21.5L16.3 18.3L19.9 17.5L19.6 13.8L22 11ZM17.7 15.9L15 16.5L13.6 18.9L11 17.8L8.4 18.9L7 16.5L4.3 15.9L4.5 13.1L2.7 11L4.5 8.9L4.3 6.1L7 5.5L8.4 3.1L11 4.2L13.6 3.1L15 5.5L17.7 6.1L17.5 8.9L19.3 11L17.5 13.1L17.7 15.9ZM15.6 6.6L17 8L9 16L5 12L6.4 10.6L9 13.2L15.6 6.6Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
