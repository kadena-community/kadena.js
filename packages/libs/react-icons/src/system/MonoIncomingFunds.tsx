import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoIncomingFunds = (
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
    <path d="M17.36 7.68a1 1 0 0 0-.02-1.39c-.38-.38-1-.38-1.39-.02l-7.83 7.82L6 11.97v5.66h5.66l-2.12-2.12z" />
  </svg>
);
export default MonoIncomingFunds;
