import * as React from 'react';
import { SVGProps } from 'react';

const ArrowCollapseDown: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M19.92 12.08L12 20L4.08 12.08L5.5 10.67L11 16.17V2H13V16.17L18.5 10.66L19.92 12.08ZM12 20H2V22H22V20H12Z"
    />
  </svg>
);

export { ArrowCollapseDown };
