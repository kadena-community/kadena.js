import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoChangeCircle = (
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m.06 17v-2.01H12c-1.28 0-2.56-.49-3.54-1.46a5.006 5.006 0 0 1-.64-6.29l1.1 1.1c-.71 1.33-.53 3.01.59 4.13.7.7 1.62 1.03 2.54 1.01v-2.14l2.83 2.83zm4.11-4.24-1.1-1.1c.71-1.33.53-3.01-.59-4.13A3.48 3.48 0 0 0 12 8.5h-.06v2.15L9.11 7.83 11.94 5v2.02c1.3-.02 2.61.45 3.6 1.45 1.7 1.7 1.91 4.35.63 6.29" />
  </svg>
);
export default MonoChangeCircle;
