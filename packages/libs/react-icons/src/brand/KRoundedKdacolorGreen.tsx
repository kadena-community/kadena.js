import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoKRoundedKdacolorGreen = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
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
      fill="#4A9079"
      d="m52.714 52-14.493-.007-18.066-14.1L27.503 32zM52.714 12H38.228L20.155 26.108 27.503 32zM20.15 51.993l-8.994-7.107V19.114l8.994-7.107z"
    />
  </svg>
);
export default MonoKRoundedKdacolorGreen;
