import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoKAccount = (
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
    <path d="M7.346 18H5V6h2.346v4.783L11.796 6h2.913l-4.531 4.8L15 18h-2.75l-3.722-5.606-1.182 1.242z" />
    <path d="M17.56 15.44a1.5 1.5 0 1 0-2.12 2.12 1.5 1.5 0 0 0 2.12-2.12M17.56 10.94a1.5 1.5 0 1 0-2.12 2.12 1.5 1.5 0 0 0 2.12-2.12" />
  </svg>
);
export default MonoKAccount;
