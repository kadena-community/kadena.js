import * as React from 'react';
import { type SVGProps } from 'react';

const Backburger: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M4.99999 13L8.99999 17L7.59999 18.42L1.17999 12L7.59999 5.58L8.99999 7L4.99999 11H21V13H4.99999ZM21 6V8H11V6H21ZM21 16V18H11V16H21Z"
    />
  </svg>
);

export { Backburger };
