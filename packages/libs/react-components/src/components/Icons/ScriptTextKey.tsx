import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={21}
    height={21}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.8 17C15.4 15.8 14.3 15 13 15C11.3 15 10 16.3 10 18C10 19.7 11.3 21 13 21C14.3 21 15.4 20.2 15.8 19H17V21H19V19H21V17H15.8ZM13 19.3C12.3 19.3 11.7 18.7 11.7 18C11.7 17.3 12.3 16.7 13 16.7C13.7 16.7 14.3 17.3 14.3 18C14.3 18.7 13.7 19.3 13 19.3ZM13 13C14.1 13 15.2 13.4 16 14V3C16 2.4 16.4 2 17 2C17.6 2 18 2.4 18 3V4H20V3C20 1.3 18.7 0 17 0H6C4.3 0 3 1.3 3 3V14H10C10.8 13.4 11.9 13 13 13ZM6 4H13V6H6V4ZM6 8H12V10H6V8ZM8.4 20H3C1.3 20 0 18.7 0 17V16H8.4C8.1 16.6 8 17.3 8 18C8 18.7 8.1 19.4 8.4 20Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
