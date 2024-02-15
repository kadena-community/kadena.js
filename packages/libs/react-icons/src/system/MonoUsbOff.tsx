import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoUsbOff = (
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
    <path d="M15 8h4v4h-1v2c0 .34-.08.66-.23.94L16 13.17V12h-1zm-4 .17 2 2V6h2l-3-4-3 4h2zM13 16v2.28c.6.34 1 .98 1 1.72 0 1.1-.9 2-2 2s-2-.9-2-2c0-.74.4-1.37 1-1.72V16H8c-1.11 0-2-.89-2-2v-2.28c-.6-.34-1-.98-1-1.72 0-.59.26-1.13.68-1.49L1.39 4.22 2.8 2.81l18.38 18.38-1.41 1.41-6.6-6.6zm-2-2v-.17l-2.51-2.51c-.14.16-.31.29-.49.4V14z" />
  </svg>
);
export default MonoUsbOff;
