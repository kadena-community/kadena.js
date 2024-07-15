import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SpireKeyKdacolorLogoWhite = (
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
      fill="black"
      d="m40.713 45.928 6.968 3.45-5.458 3.966zM58.359 41.621l-18.97-2.19-.95-4.671 17.69-.001zM16.319 49.378l6.978-3.45-1.491 7.438zM24.6 39.43 5.642 41.622 7.87 34.76h17.668z"
    />
    <path
      fill="black"
      d="M52.527 23.674 38.438 34.76l-6.45-2.218-6.45 2.218-14.07-11.074 2.108-6.484 11.015 7.402 4.107 7.577V10.634h6.58v20.94l4.106-6.97 11.037-7.41z"
    />
  </svg>
);
export default SpireKeyKdacolorLogoWhite;
