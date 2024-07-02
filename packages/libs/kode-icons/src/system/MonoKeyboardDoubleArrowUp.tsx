import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoKeyboardDoubleArrowUp = (
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
    <path d="M6 17.59 7.41 19 12 14.42 16.59 19 18 17.59l-6-6z" />
    <path d="m6 11 1.41 1.41L12 7.83l4.59 4.58L18 11l-6-6z" />
  </svg>
);
export default MonoKeyboardDoubleArrowUp;
