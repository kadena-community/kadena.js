import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoFace4 = (
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
    <path d="M12 2c-.96 0-1.88.14-2.75.39A4.99 4.99 0 0 0 5 0C2.24 0 0 2.24 0 5c0 1.8.96 3.37 2.39 4.25C2.14 10.12 2 11.04 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8 0-.05.01-.1.01-.15 2.6-.98 4.68-2.99 5.74-5.55a9.94 9.94 0 0 0 9.92 3.46c.21.71.33 1.46.33 2.24 0 4.41-3.59 8-8 8" />
    <circle cx={9} cy={13} r={1.25} />
    <circle cx={15} cy={13} r={1.25} />
  </svg>
);
export default MonoFace4;
