import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoMoveUp = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="mono"
    viewBox="0 0 24 24"
    fontSize="1.5em"
    fill="currentColor"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M3 13c0-2.45 1.76-4.47 4.08-4.91l-1.49 1.5L7 11l4-4.01L7 3 5.59 4.41l1.58 1.58v.06A7.007 7.007 0 0 0 1 13c0 3.87 3.13 7 7 7h3v-2H8c-2.76 0-5-2.24-5-5m10 0v7h9v-7zm7 5h-5v-3h5zM13 4h9v7h-9z" />
  </svg>
);
export default MonoMoveUp;
