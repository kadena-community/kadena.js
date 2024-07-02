import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoTextRotateVertical = (
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
    <path d="M15.75 5h-1.5L9.5 16h2.1l.9-2.2h5l.9 2.2h2.1zm-2.62 7L15 6.98 16.87 12zM6 19.75l3-3H7V4.25H5v12.5H3z" />
  </svg>
);
export default MonoTextRotateVertical;
