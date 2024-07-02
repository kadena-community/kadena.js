import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoOutgoingMultichainFunds = (
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
    <path d="m11.98 6 2.12 2.12-4.98 4.98a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0l4.98-4.98 2.12 2.12V6h-5.66zM6.29 15.93a.996.996 0 0 0 0 1.41c.39.38 1.03.39 1.41 0s.39-1.03 0-1.41a.996.996 0 0 0-1.41 0" />
  </svg>
);
export default MonoOutgoingMultichainFunds;
