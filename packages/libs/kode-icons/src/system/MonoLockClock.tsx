import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoLockClock = (
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
    <path d="m14.5 14.2 2.9 1.7-.8 1.3L13 15v-5h1.5zM22 14c0 4.41-3.59 8-8 8-2.02 0-3.86-.76-5.27-2H4c-1.15 0-2-.85-2-2V9c0-1.12.89-1.96 2-2v-.5C4 4.01 6.01 2 8.5 2c2.34 0 4.24 1.79 4.46 4.08.34-.05.69-.08 1.04-.08 4.41 0 8 3.59 8 8M6 7h5v-.74A2.51 2.51 0 0 0 8.5 4 2.5 2.5 0 0 0 6 6.5zm14 7c0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6 6-2.69 6-6" />
  </svg>
);
export default MonoLockClock;
