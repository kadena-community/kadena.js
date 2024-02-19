import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoSettingsEthernet = (
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
    <path d="M7.77 6.76 6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12zM7 13h2v-2H7zm10-2h-2v2h2zm-6 2h2v-2h-2zm6.77-7.52-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12z" />
  </svg>
);
export default MonoSettingsEthernet;
