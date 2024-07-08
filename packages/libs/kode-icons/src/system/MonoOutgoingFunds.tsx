import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoOutgoingFunds = (
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
    <path d="m11.97 6 2.12 2.12-7.82 7.83a1 1 0 0 0 .02 1.39c.38.38 1 .38 1.39.02l7.83-7.82 2.12 2.12V6z" />
  </svg>
);
export default MonoOutgoingFunds;
