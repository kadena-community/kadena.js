import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoRadar = (
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
    <path d="M19.74 18.33A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10a9.98 9.98 0 0 0 7.11-2.97c.03-.03.05-.06.07-.08.2-.2.39-.41.56-.62M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.85-.63 3.54-1.69 4.9l-1.43-1.43c.69-.98 1.1-2.17 1.1-3.46 0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6c1.3 0 2.51-.42 3.49-1.13l1.42 1.42A7.82 7.82 0 0 1 12 20m1.92-7.49c.17-.66.02-1.38-.49-1.9l-.02-.02c-.77-.77-2-.78-2.78-.04-.01.01-.03.02-.05.04-.78.78-.78 2.05 0 2.83l.02.02c.52.51 1.25.67 1.91.49l1.51 1.51c-.6.36-1.29.58-2.04.58-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .73-.21 1.41-.56 2z" />
  </svg>
);
export default MonoRadar;
