import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoSyncDisabled = (
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
    <path d="M10 6.35V4.26c-.8.21-1.55.54-2.23.96l1.46 1.46c.25-.12.5-.24.77-.33m-7.14-.94 2.36 2.36a7.925 7.925 0 0 0 1.14 9.87L4 20h6v-6l-2.24 2.24A6 6 0 0 1 6 12c0-1 .25-1.94.68-2.77l8.08 8.08c-.25.13-.5.25-.77.34v2.09c.8-.21 1.55-.54 2.23-.96l2.36 2.36 1.27-1.27L4.14 4.14zM20 4h-6v6l2.24-2.24A6 6 0 0 1 18 12c0 1-.25 1.94-.68 2.77l1.46 1.46a7.925 7.925 0 0 0-1.14-9.87z" />
  </svg>
);
export default MonoSyncDisabled;
