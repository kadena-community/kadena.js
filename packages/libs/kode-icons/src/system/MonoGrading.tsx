import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoGrading = (
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
    <path d="M4 7h16v2H4zm0 6h16v-2H4zm0 4h7v-2H4zm0 4h7v-2H4zm11.41-2.83L14 16.75l-1.41 1.41L15.41 21 20 16.42 18.58 15zM4 3v2h16V3z" />
  </svg>
);
export default MonoGrading;
