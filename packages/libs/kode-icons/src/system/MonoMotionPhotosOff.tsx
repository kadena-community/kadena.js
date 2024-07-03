import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoMotionPhotosOff = (
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
    <path d="M20.84 20.84 3.16 3.16 1.89 4.43l1.89 1.89A9.9 9.9 0 0 0 2 12c0 5.52 4.48 10 10 10 2.11 0 4.07-.66 5.68-1.77l1.89 1.89zM12 20c-4.41 0-8-3.59-8-8 0-1.55.45-3 1.22-4.23l1.46 1.46C6.25 10.06 6 11 6 12c0 3.31 2.69 6 6 6 1 0 1.94-.25 2.77-.68l1.46 1.46A7.95 7.95 0 0 1 12 20M6.32 3.77A10 10 0 0 1 12 2c5.52 0 10 4.48 10 10 0 2.11-.66 4.07-1.77 5.68l-1.45-1.45A7.95 7.95 0 0 0 20 12c0-4.41-3.59-8-8-8-1.55 0-3 .45-4.23 1.22zM18 12c0 1-.25 1.94-.68 2.77L9.23 6.68C10.06 6.25 11 6 12 6c3.31 0 6 2.69 6 6" />
  </svg>
);
export default MonoMotionPhotosOff;
