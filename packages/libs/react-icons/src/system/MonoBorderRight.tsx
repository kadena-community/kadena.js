import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBorderRight = (
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
    <path d="M7 21h2v-2H7zM3 5h2V3H3zm4 0h2V3H7zm0 8h2v-2H7zm-4 8h2v-2H3zm8 0h2v-2h-2zm-8-8h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm8 8h2v-2h-2zm4-4h2v-2h-2zm4-10v18h2V3zm-4 18h2v-2h-2zm0-16h2V3h-2zm-4 8h2v-2h-2zm0-8h2V3h-2zm0 4h2V7h-2z" />
  </svg>
);
export default MonoBorderRight;
