import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoCenterFocusStrong = (
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
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m-7 7H3v4c0 1.1.9 2 2 2h4v-2H5zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2m0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2z" />
  </svg>
);
export default MonoCenterFocusStrong;
