import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBorderLeft = (
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
    <path d="M11 21h2v-2h-2zm0-4h2v-2h-2zm0-12h2V3h-2zm0 4h2V7h-2zm0 4h2v-2h-2zm-4 8h2v-2H7zM7 5h2V3H7zm0 8h2v-2H7zm-4 8h2V3H3zM19 9h2V7h-2zm-4 12h2v-2h-2zm4-4h2v-2h-2zm0-14v2h2V3zm0 10h2v-2h-2zm0 8h2v-2h-2zm-4-8h2v-2h-2zm0-8h2V3h-2z" />
  </svg>
);
export default MonoBorderLeft;
