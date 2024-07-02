import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoAssuredWorkload = (
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
    <path d="M5 10h2v7H5zm6 0h2v7h-2zm11-4L12 1 2 6v2h20zM2 19v2h12.4c-.21-.64-.32-1.31-.36-2zm17-6.74V10h-2v3.26zM20 14l-4 2v2.55c0 2.52 1.71 4.88 4 5.45 2.29-.57 4-2.93 4-5.45V16zm-.72 7-2.03-2.03 1.06-1.06.97.97 2.41-2.38 1.06 1.06z" />
  </svg>
);
export default MonoAssuredWorkload;
