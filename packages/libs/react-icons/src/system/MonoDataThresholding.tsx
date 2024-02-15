import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoDataThresholding = (
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
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-8.33 5.17 2 2 3.67-3.67 1.41 1.41L12.67 13l-2-2-3 3-1.41-1.41zM5 16h1.72L5 17.72zm.84 3 3-3h1.83l-3 3zm3.96 0 3-3h1.62l-3 3zm3.73 0 3-3h1.62l-3 3zM19 19h-1.73L19 17.27z" />
  </svg>
);
export default MonoDataThresholding;
