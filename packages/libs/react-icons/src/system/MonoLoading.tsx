import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoLoading = (
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
    <path d="M16.9 5.7c-1.1-.9-2.4-1.4-3.9-1.6V2c2 .2 3.8 1 5.3 2.2zm3 5.3h2c-.2-2-1-3.8-2.2-5.3l-1.4 1.4c.9 1.1 1.5 2.5 1.6 3.9m-1.6 5.9 1.4 1.4c1.2-1.5 2-3.4 2.2-5.3h-2c-.1 1.4-.7 2.8-1.6 3.9m-5.3 3v2c2-.2 3.8-1 5.3-2.2l-1.4-1.4c-1.1.9-2.4 1.5-3.9 1.6M2 12c0 5.2 4 9.5 9 10v-2c-4-.5-7-3.8-7-7.9s3-7.4 7-7.9V2c-5 .5-9 4.8-9 10" />
  </svg>
);
export default MonoLoading;
