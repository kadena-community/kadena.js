import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoMarkEmailRead = (
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
    <path d="M12 19a6.995 6.995 0 0 1 10-6.32V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8.08c-.05-.33-.08-.66-.08-1M4 6l8 5 8-5v2l-8 5-8-5zm13.34 16-3.54-3.54 1.41-1.41 2.12 2.12 4.24-4.24L23 16.34z" />
  </svg>
);
export default MonoMarkEmailRead;
