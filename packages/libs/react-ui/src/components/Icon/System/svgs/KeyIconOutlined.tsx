import type { SVGProps } from 'react';
import * as React from 'react';

const KeyIconOutlined: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M21 18H15V15H13.3C12.2 17.4 9.7 19 7 19C3.1 19 0 15.9 0 12C0 8.1 3.1 5 7 5C9.7 5 12.2 6.6 13.3 9H24V15H21V18ZM17 16H19V13H22V11H11.9L11.7 10.3C11 8.3 9.1 7 7 7C4.2 7 2 9.2 2 12C2 14.8 4.2 17 7 17C9.1 17 11 15.7 11.7 13.7L11.9 13H17V16ZM7 15C5.3 15 4 13.7 4 12C4 10.3 5.3 9 7 9C8.7 9 10 10.3 10 12C10 13.7 8.7 15 7 15ZM7 11C6.4 11 6 11.4 6 12C6 12.6 6.4 13 7 13C7.6 13 8 12.6 8 12C8 11.4 7.6 11 7 11Z"
    />
  </svg>
);

export { KeyIconOutlined };
