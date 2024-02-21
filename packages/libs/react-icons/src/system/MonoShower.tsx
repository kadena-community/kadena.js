import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoShower = (
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
    <circle cx={8} cy={17} r={1} />
    <circle cx={12} cy={17} r={1} />
    <circle cx={16} cy={17} r={1} />
    <path d="M13 5.08V3h-2v2.08C7.61 5.57 5 8.47 5 12v2h14v-2c0-3.53-2.61-6.43-6-6.92" />
    <circle cx={8} cy={20} r={1} />
    <circle cx={12} cy={20} r={1} />
    <circle cx={16} cy={20} r={1} />
  </svg>
);
export default MonoShower;
