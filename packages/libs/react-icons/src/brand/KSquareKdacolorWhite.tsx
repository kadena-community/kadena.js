import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const KSquareKdacolorWhite = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    data-style="kdacolor"
    viewBox="0 0 64 64"
    fontSize="1.5em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#F5F5F5"
      d="m56.87 56-17.392-.009-21.679-16.92L26.618 32zM56.87 8H39.487L17.799 24.93 26.618 32zM17.794 55.991 7 47.463V16.537l10.794-8.528z"
    />
  </svg>
);
export default KSquareKdacolorWhite;
