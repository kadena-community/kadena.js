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
<<<<<<<< HEAD:packages/apps/marmalade-marketplace/src/components/SpireKeyKdacolorLogoWhite/index.tsx
      fill="black"
      d="m40.713 45.928 6.968 3.45-5.458 3.966zM58.359 41.621l-18.97-2.19-.95-4.671 17.69-.001zM16.319 49.378l6.978-3.45-1.491 7.438zM24.6 39.43 5.642 41.622 7.87 34.76h17.668z"
    />
    <path
      fill="black"
      d="M52.527 23.674 38.438 34.76l-6.45-2.218-6.45 2.218-14.07-11.074 2.108-6.484 11.015 7.402 4.107 7.577V10.634h6.58v20.94l4.106-6.97 11.037-7.41z"
========
      fill="#F5F5F5"
      d="m16.3 49.4 7-3.4-1.5 7.4zM24.6 39.4 5.7 41.6l2.2-6.9h17.7l-.9 4.7ZM28.7 32.2l-2.1-3.8zM24.6 24.6l2 3.8zM42.2 53.3l-1.5-7.4 7 3.4zM38.4 34.7h17.7l2.2 6.9-18.9-2.2-.9-4.7ZM35.3 32.2l2-3.8zM39.4 24.6l-2.1 3.8zM28.7 10.6v21.6l.7 1.2 2.6-.9 2.6.9.7-1.2V10.6z"
    />
    <path
      fill="#F5F5F5"
      d="m39.4 24.6 11-7.4 2.1 6.5-14.1 11-3.8-1.3zM24.6 24.6l-11-7.4-2.1 6.5 14 11 3.9-1.3z"
>>>>>>>> 2397b1e20 (UI and Icon Library references refactored):packages/libs/kode-icons/src/product/SpireKeyKdacolorLogoWhite.tsx
    />
  </svg>
);
export default SpireKeyKdacolorLogoWhite;