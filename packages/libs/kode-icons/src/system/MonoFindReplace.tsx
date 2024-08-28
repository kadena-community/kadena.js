import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoFindReplace = (
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
    <path d="M11 6c1.38 0 2.63.56 3.54 1.46L12 10h6V4l-2.05 2.05A6.98 6.98 0 0 0 11 4c-3.53 0-6.43 2.61-6.92 6H6.1A5 5 0 0 1 11 6m5.64 9.14A6.9 6.9 0 0 0 17.92 12H15.9a5 5 0 0 1-4.9 4c-1.38 0-2.63-.56-3.54-1.46L10 12H4v6l2.05-2.05A6.98 6.98 0 0 0 11 18c1.55 0 2.98-.51 4.14-1.36L20 21.49 21.49 20z" />
  </svg>
);
export default MonoFindReplace;
