import type { SVGProps } from 'react';
import * as React from 'react';

const Twitter: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M2.75776 3.60413L9.92776 13.199L2.71248 21H4.33635L10.6533 14.1701L15.7573 21H21.2833L13.7099 10.8655L20.4259 3.60413H18.802L12.9844 9.89434L8.28385 3.60413H2.75776ZM5.14578 4.80125H7.68448L18.895 19.8027H16.3563L5.14578 4.80125Z"
      fill="currentColor"
    />
  </svg>
);

export { Twitter };
