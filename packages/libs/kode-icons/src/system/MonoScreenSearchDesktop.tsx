import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoScreenSearchDesktop = (
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
    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6a2 2 0 0 0-2-2H4c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2H0v2h24v-2zM4 16V6h16v10.01zm5.097-6.047c0-1.027.836-1.864 1.864-1.864 1.027 0 1.864.837 1.864 1.864a1.867 1.867 0 0 1-1.864 1.864 1.867 1.867 0 0 1-1.864-1.864m7.032 4.236-2.482-2.482a3.2 3.2 0 0 0 .527-1.754A3.216 3.216 0 0 0 10.96 6.74a3.217 3.217 0 0 0-3.214 3.213 3.22 3.22 0 0 0 3.214 3.214 3.2 3.2 0 0 0 1.724-.51l2.489 2.487.955-.955Z" />
  </svg>
);
export default MonoScreenSearchDesktop;