import * as React from 'react';
import { type SVGProps } from 'react';

const SlashForward: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fill="currentColor" d="M7 21L14.9 3H17L9.1 21H7Z" />
  </svg>
);

export { SlashForward };
