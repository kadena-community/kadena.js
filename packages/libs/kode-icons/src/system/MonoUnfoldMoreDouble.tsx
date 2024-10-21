import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoUnfoldMoreDouble = (
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
    <path d="M12 7.83 15.17 11l1.41-1.41L12 5 7.41 9.59 8.83 11zm0-5L15.17 6l1.41-1.41L12 0 7.41 4.59 8.83 6zm0 18.34L8.83 18l-1.41 1.41L12 24l4.59-4.59L15.17 18zm0-5L8.83 13l-1.41 1.41L12 19l4.59-4.59L15.17 13z" />
  </svg>
);
export default MonoUnfoldMoreDouble;
