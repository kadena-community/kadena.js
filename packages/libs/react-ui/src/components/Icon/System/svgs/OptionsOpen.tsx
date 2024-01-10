import type { SVGProps } from 'react';
import * as React from 'react';

const OptionsOpen: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 9H2V7H7V9ZM7 12H2V14H7V12ZM20.59 19L16.76 15.17C15.96 15.69 15.02 16 14 16C11.24 16 9 13.76 9 11C9 8.24 11.24 6 14 6C16.76 6 19 8.24 19 11C19 12.02 18.69 12.96 18.17 13.75L22 17.59L20.59 19ZM17 11C17 9.35 15.65 8 14 8C12.35 8 11 9.35 11 11C11 12.65 12.35 14 14 14C15.65 14 17 12.65 17 11ZM2 19H12V17H2V19Z"
      fill="currentColor"
    />
  </svg>
);

export { OptionsOpen };
