import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBorderBottom = (
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
    <path d="M9 11H7v2h2zm4 4h-2v2h2zM9 3H7v2h2zm4 8h-2v2h2zM5 3H3v2h2zm8 4h-2v2h2zm4 4h-2v2h2zm-4-8h-2v2h2zm4 0h-2v2h2zm2 10h2v-2h-2zm0 4h2v-2h-2zM5 7H3v2h2zm14-4v2h2V3zm0 6h2V7h-2zM5 11H3v2h2zM3 21h18v-2H3zm2-6H3v2h2z" />
  </svg>
);
export default MonoBorderBottom;
