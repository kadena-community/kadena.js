import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const IconKeyboardDoubleArrowDown = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fontSize="1.5em"
    fill="currentColor"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M18 6.41 16.59 5 12 9.58 7.41 5 6 6.41l6 6z" />
    <path d="m18 13-1.41-1.41L12 16.17l-4.59-4.58L6 13l6 6z" />
  </svg>
);
export default IconKeyboardDoubleArrowDown;
