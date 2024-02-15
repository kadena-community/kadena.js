import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoZoomInMap = (
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
    <path d="M9 9V3H7v2.59L3.91 2.5 2.5 3.91 5.59 7H3v2zm12 0V7h-2.59l3.09-3.09-1.41-1.41L17 5.59V3h-2v6zM3 15v2h2.59L2.5 20.09l1.41 1.41L7 18.41V21h2v-6zm12 0v6h2v-2.59l3.09 3.09 1.41-1.41L18.41 17H21v-2z" />
  </svg>
);
export default MonoZoomInMap;
