import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoRoundaboutLeft = (
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
    <path d="M10.08 8A6 6 0 0 1 16 3c3.31 0 6 2.69 6 6 0 2.97-2.16 5.44-5 5.92V21h-2v-6.09c0-.98.71-1.8 1.67-1.97a3.999 3.999 0 1 0-4.61-4.61c-.17.96-.99 1.67-1.97 1.67H5.83l1.59 1.59L6 13 2 9l4-4 1.41 1.41L5.83 8z" />
  </svg>
);
export default MonoRoundaboutLeft;
