import * as React from 'react';
import { type SVGProps } from 'react';

const TrailingIcon: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M8.59 16.58L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.58Z"
    />
  </svg>
);

export { TrailingIcon };
