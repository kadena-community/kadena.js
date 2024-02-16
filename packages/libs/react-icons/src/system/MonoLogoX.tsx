import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoLogoX = (
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
    <path d="m2.758 3.604 7.17 9.595L2.712 21h1.624l6.317-6.83L15.757 21h5.526L13.71 10.866l6.716-7.262h-1.624l-5.818 6.29-4.7-6.29zm2.388 1.197h2.538l11.211 15.002h-2.539z" />
  </svg>
);
export default MonoLogoX;
