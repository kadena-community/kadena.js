import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoCurrencyRuble = (
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
    <path d="M13.5 3H7v9H5v2h2v2H5v2h2v3h2v-3h4v-2H9v-2h4.5c3.04 0 5.5-2.46 5.5-5.5S16.54 3 13.5 3m0 9H9V5h4.5C15.43 5 17 6.57 17 8.5S15.43 12 13.5 12" />
  </svg>
);
export default MonoCurrencyRuble;
