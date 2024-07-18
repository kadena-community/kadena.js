import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoOpenInNewOff = (
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
    <path d="M16.79 5.8 14 3h7v7l-2.79-2.8-4.09 4.09-1.41-1.41zM19 12v4.17l2 2V12zm.78 10.61L18.17 21H5a2 2 0 0 1-2-2V5.83L1.39 4.22 2.8 2.81l18.38 18.38zM16.17 19l-4.88-4.88-1.59 1.59-1.41-1.41 1.59-1.59L5 7.83V19zM7.83 5H12V3H5.83z" />
  </svg>
);
export default MonoOpenInNewOff;
