import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoFormatAlignCenter = (
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
    <path d="M7 15v2h10v-2zm-4 6h18v-2H3zm0-8h18v-2H3zm4-6v2h10V7zM3 3v2h18V3z" />
  </svg>
);
export default MonoFormatAlignCenter;
