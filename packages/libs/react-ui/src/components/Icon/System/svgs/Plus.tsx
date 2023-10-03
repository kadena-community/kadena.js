import type { SVGProps } from 'react';
import * as React from 'react';

const Plus: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fill="currentColor" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
  </svg>
);

export { Plus };
