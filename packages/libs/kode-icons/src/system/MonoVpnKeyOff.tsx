import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoVpnKeyOff = (
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
    <path d="M20.83 18H21v-4h2v-4H12.83zm-1.05 4.61 1.41-1.41L2.81 2.81 1.39 4.22l2.59 2.59A6.01 6.01 0 0 0 1 12c0 3.31 2.69 6 6 6 2.21 0 4.15-1.2 5.18-2.99zM8.99 11.82c.01.06.01.12.01.18 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.06 0 .12 0 .18.01z" />
  </svg>
);
export default MonoVpnKeyOff;
