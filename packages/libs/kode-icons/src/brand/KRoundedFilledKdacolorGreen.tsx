import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const KRoundedFilledKdacolorGreen = (
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
    <circle cx={32} cy={32} r={24} fill="#131E2B" />
    <path
      fill="#4A9079"
      d="m45 45-9.348-.005L24 35.83 28.74 32zM45 19h-9.343L24 28.17 28.74 32zM24 45l-6-4.621V23.62L24 19z"
    />
  </svg>
);
export default KRoundedFilledKdacolorGreen;
