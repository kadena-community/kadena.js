import * as React from 'react';
import { SVGProps } from 'react';

const ScriptTextKeyNew: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9 6C10.9656 5.67689 11 5.34247 11 5C11 3.87439 10.6281 2.83566 10.0004 2H19C20.7 2 22 3.3 22 5V6H20V5C20 4.4 19.6 4 19 4C18.4 4 18 4.4 18 5V16C17.2 15.4 16.1 15 15 15C13.9 15 12.8 15.4 12 16H5V9.89998C5.32311 9.96557 5.65753 10 6 10C7.63582 10 9.08816 9.21445 10.0004 8H15V6H10.9ZM15 17C16.3 17 17.4 17.8 17.8 19H23V21H21V23H19V21H17.8C17.4 22.2 16.3 23 15 23C13.3 23 12 21.7 12 20C12 18.3 13.3 17 15 17ZM13.7 20C13.7 20.7 14.3 21.3 15 21.3C15.7 21.3 16.3 20.7 16.3 20C16.3 19.3 15.7 18.7 15 18.7C14.3 18.7 13.7 19.3 13.7 20ZM14 12V10H8V12H14ZM5 22H10.4C10.1 21.4 10 20.7 10 20C10 19.3 10.1 18.6 10.4 18H2V19C2 20.7 3.3 22 5 22Z"
    />
    <path d="M9 6H7V8H5V6H3V4H5V2H7V4H9V6Z" fill="currentColor" />
  </svg>
);

export { ScriptTextKeyNew };
