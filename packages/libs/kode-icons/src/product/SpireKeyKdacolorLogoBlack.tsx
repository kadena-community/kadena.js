import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SpireKeyKdacolorLogoBlack = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="kdacolor"
    viewBox="0 0 64 64"
    fontSize="1.5em"
    fill="currentColor"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#020E1B"
      d="m16.3 49.4 7-3.4-1.5 7.4zM24.6 39.4 5.7 41.6l2.2-6.9h17.7l-.9 4.7ZM28.7 32.2l-2.1-3.8zM24.6 24.6l2 3.8zM42.2 53.3l-1.5-7.4 7 3.4zM38.4 34.7h17.7l2.2 6.9-18.9-2.2-.9-4.7ZM35.3 32.2l2-3.8zM39.4 24.6l-2.1 3.8zM28.7 10.6v21.6l.7 1.2 2.6-.9 2.6.9.7-1.2V10.6z"
    />
    <path
      fill="#020E1B"
      d="m39.4 24.6 11-7.4 2.1 6.5-14.1 11-3.8-1.3zM24.6 24.6l-11-7.4-2.1 6.5 14 11 3.9-1.3z"
    />
  </svg>
);
export default SpireKeyKdacolorLogoBlack;
