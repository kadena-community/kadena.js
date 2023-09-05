import type { SVGProps } from 'react';
import * as React from 'react';

const ShieldAccountVariantOutline: React.FC<SVGProps<SVGSVGElement>> = (
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
      d="M17 14.4C17.6 14.4 18.1 14.9 18.1 15.5C18.1 16.1 17.6 16.6 17 16.6C16.4 16.6 15.9 16.1 15.9 15.5C15.9 14.9 16.4 14.4 17 14.4ZM17 17.5C16.3 17.5 14.8 17.9 14.8 18.6C15.3 19.3 16.1 19.8 17 19.8C17.9 19.8 18.7 19.3 19.2 18.6C19.2 17.9 17.7 17.5 17 17.5ZM18 11.1V6.3L10.5 3L3 6.3V11.2C3 15.7 6.2 20 10.5 21C11.1 20.9 11.6 20.7 12.1 20.5C13.2 22 15 23 17 23C20.3 23 23 20.3 23 17C23 14 20.8 11.6 18 11.1ZM11 17C11 17.6 11.1 18.1 11.2 18.6C11 18.7 10.7 18.8 10.5 18.9C7.3 17.9 5 14.7 5 11.2V7.6L10.5 5.2L16 7.6V11.1C13.2 11.6 11 14 11 17ZM17 21C14.8 21 13 19.2 13 17C13 14.8 14.8 13 17 13C19.2 13 21 14.8 21 17C21 19.2 19.2 21 17 21Z"
    />
  </svg>
);

export { ShieldAccountVariantOutline };
