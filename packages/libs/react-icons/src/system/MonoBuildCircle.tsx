import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBuildCircle = (
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
    <path
      fillRule="evenodd"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m4.9 13.49-1.4 1.4c-.2.2-.51.2-.71 0l-3.41-3.41c-1.22.43-2.64.17-3.62-.81a3.47 3.47 0 0 1-.59-4.1l2.35 2.35 1.41-1.41-2.35-2.34c1.32-.71 2.99-.52 4.1.59.98.98 1.24 2.4.81 3.62l3.41 3.41c.19.19.19.51 0 .7"
    />
  </svg>
);
export default MonoBuildCircle;
