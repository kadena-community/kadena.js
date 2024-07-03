import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBorderHorizontal = (
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
    <path d="M3 21h2v-2H3zM5 7H3v2h2zM3 17h2v-2H3zm4 4h2v-2H7zM5 3H3v2h2zm4 0H7v2h2zm8 0h-2v2h2zm-4 4h-2v2h2zm0-4h-2v2h2zm6 14h2v-2h-2zm-8 4h2v-2h-2zm-8-8h18v-2H3zM19 3v2h2V3zm0 6h2V7h-2zm-8 8h2v-2h-2zm4 4h2v-2h-2zm4 0h2v-2h-2z" />
  </svg>
);
export default MonoBorderHorizontal;
