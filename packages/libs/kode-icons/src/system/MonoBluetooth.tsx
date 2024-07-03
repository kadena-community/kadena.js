import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBluetooth = (
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
    <path d="M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29zM13 5.83l1.88 1.88L13 9.59zm1.88 10.46L13 18.17v-3.76z" />
  </svg>
);
export default MonoBluetooth;
