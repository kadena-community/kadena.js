import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoCAccount = (
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
    <path d="M3.384 11.984c0 3.44 2.288 5.92 5.504 5.92 1.584 0 2.688-.48 3.472-1.216a4.05 4.05 0 0 0 1.264-2.704h-2.272C11.208 15.184 10.248 16 8.888 16c-1.92 0-3.136-1.68-3.136-4.016 0-2.272 1.008-4.032 3.12-4.032 1.344 0 2.208.752 2.416 1.904h2.304C13.352 7.68 11.688 6 8.872 6c-3.376 0-5.488 2.592-5.488 5.984M16.5 8.164a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
  </svg>
);
export default MonoCAccount;
