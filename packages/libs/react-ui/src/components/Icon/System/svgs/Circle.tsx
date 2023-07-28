import * as React from 'react';
import { SVGProps } from 'react';

const Circle: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8.00002 6.66666C7.6464 6.66666 7.30726 6.80713 7.05721 7.05718C6.80716 7.30723 6.66669 7.64637 6.66669 7.99999C6.66669 8.73999 7.26669 9.33332 8.00002 9.33332C8.74002 9.33332 9.33335 8.73999 9.33335 7.99999C9.33335 7.64637 9.19288 7.30723 8.94283 7.05718C8.69278 6.80713 8.35364 6.66666 8.00002 6.66666Z" />
  </svg>
);

export { Circle };
