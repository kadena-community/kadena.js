import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoKeyboardDoubleArrowLeft = (
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
    <path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z" />
    <path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z" />
  </svg>
);
export default MonoKeyboardDoubleArrowLeft;
