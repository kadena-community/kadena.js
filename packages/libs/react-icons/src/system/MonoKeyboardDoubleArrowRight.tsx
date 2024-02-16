import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoKeyboardDoubleArrowRight = (
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
    <path d="M6.41 6 5 7.41 9.58 12 5 16.59 6.41 18l6-6z" />
    <path d="m13 6-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z" />
  </svg>
);
export default MonoKeyboardDoubleArrowRight;
