import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoTextIncrease = (
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
    <path d="M.99 19h2.42l1.27-3.58h5.65L11.59 19h2.42L8.75 5h-2.5zm4.42-5.61L7.44 7.6h.12l2.03 5.79zM20 11h3v2h-3v3h-2v-3h-3v-2h3V8h2z" />
  </svg>
);
export default MonoTextIncrease;
