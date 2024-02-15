import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoSentimentSatisfied = (
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
    <circle cx={15.5} cy={9.5} r={1.5} />
    <circle cx={8.5} cy={9.5} r={1.5} />
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m0-4c-.73 0-1.38-.18-1.96-.52-.12.14-.86.98-1.01 1.15a5.49 5.49 0 0 0 5.95-.01c-.97-1.09-.01-.02-1.01-1.15-.59.35-1.24.53-1.97.53" />
  </svg>
);
export default MonoSentimentSatisfied;
