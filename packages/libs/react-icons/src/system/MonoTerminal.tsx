import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoTerminal = (
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
    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16c1.1 0 2-.9 2-2V6a2 2 0 0 0-2-2m0 14H4V8h16zm-2-1h-6v-2h6zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4z" />
  </svg>
);
export default MonoTerminal;
