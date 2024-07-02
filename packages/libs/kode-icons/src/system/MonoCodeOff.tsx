import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoCodeOff = (
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
    <path d="m19.17 12-4.58-4.59L16 6l6 6-3.59 3.59L17 14.17zM1.39 4.22l4.19 4.19L2 12l6 6 1.41-1.41L4.83 12 7 9.83l12.78 12.78 1.41-1.41L2.81 2.81z" />
  </svg>
);
export default MonoCodeOff;
