import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoPlayDisabled = (
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
    <path d="M8 5.19V5l11 7-2.55 1.63zm12 14.54-5.11-5.11L8 7.73 4.27 4 3 5.27l5 5V19l5.33-3.4 5.4 5.4z" />
  </svg>
);
export default MonoPlayDisabled;
