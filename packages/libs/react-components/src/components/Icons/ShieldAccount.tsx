import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14 11.4C14.6 11.4 15.1 11.9 15.1 12.5C15.1 13.1 14.6 13.6 14 13.6C13.4 13.6 12.9 13.1 12.9 12.5C12.9 11.9 13.4 11.4 14 11.4ZM14 14.5C13.3 14.5 11.8 14.9 11.8 15.6C12.3 16.3 13.1 16.8 14 16.8C14.9 16.8 15.7 16.3 16.2 15.6C16.2 14.9 14.7 14.5 14 14.5ZM15 8.1V3.3L7.5 0L0 3.3V8.2C0 12.7 3.2 17 7.5 18C8.1 17.9 8.6 17.7 9.1 17.5C10.2 19 12 20 14 20C17.3 20 20 17.3 20 14C20 11 17.8 8.6 15 8.1ZM8 14C8 14.6 8.1 15.1 8.2 15.6C8 15.7 7.7 15.8 7.5 15.9C4.3 14.9 2 11.7 2 8.2V4.6L7.5 2.2L13 4.6V8.1C10.2 8.6 8 11 8 14ZM14 18C11.8 18 10 16.2 10 14C10 11.8 11.8 10 14 10C16.2 10 18 11.8 18 14C18 16.2 16.2 18 14 18Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
