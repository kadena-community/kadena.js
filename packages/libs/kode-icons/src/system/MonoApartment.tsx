import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoApartment = (
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
    <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11zM7 19H5v-2h2zm0-4H5v-2h2zm0-4H5V9h2zm4 4H9v-2h2zm0-4H9V9h2zm0-4H9V5h2zm4 8h-2v-2h2zm0-4h-2V9h2zm0-4h-2V5h2zm4 12h-2v-2h2zm0-4h-2v-2h2z" />
  </svg>
);
export default MonoApartment;
